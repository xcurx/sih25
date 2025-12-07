"""
Embedding Service using Hugging Face Inference API

This module provides a lightweight embedding service that uses
the Hugging Face Inference API instead of loading models locally.
This dramatically reduces memory usage (~150MB vs ~750MB).

NOTE: Requires HF_API_TOKEN environment variable to be set.
Get your token from https://huggingface.co/settings/tokens
"""

import os
import time
import logging
from typing import List, Optional
import requests
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# Hugging Face Inference API configuration
# Use the feature-extraction pipeline endpoint for getting embeddings
HF_API_BASE = "https://router.huggingface.co/hf-inference/models"
DEFAULT_MODEL = "sentence-transformers/all-MiniLM-L6-v2"


class EmbeddingService:
    """
    Lightweight embedding service using Hugging Face Inference API.
    
    Benefits:
    - Very low memory footprint (~10MB for the service itself)
    - No PyTorch/Transformers dependencies needed at runtime
    - Free tier: ~1000 requests/day
    - Embeddings are cached in PostgreSQL after first generation
    
    Requirements:
    - HF_API_TOKEN environment variable must be set
    """
    
    def __init__(self, model_name: str = DEFAULT_MODEL):
        """
        Initialize the embedding service.
        
        Args:
            model_name: HuggingFace model to use for embeddings
        """
        self.model_name = model_name
        # Use pipeline/feature-extraction endpoint for embeddings
        self.api_url = f"{HF_API_BASE}/{model_name}/pipeline/feature-extraction"
        self.api_token = os.getenv("HF_API_TOKEN")
        self._ready = False
        self._last_error: Optional[str] = None
        
        if not self.api_token:
            logger.warning(
                "HF_API_TOKEN not set! HuggingFace Inference API requires authentication. "
                "Get your free token from https://huggingface.co/settings/tokens"
            )
        
        # Retry configuration
        self.max_retries = 3
        self.retry_delay = 2  # seconds
    
    def _get_headers(self) -> dict:
        """Get request headers with optional auth token."""
        headers = {"Content-Type": "application/json"}
        if self.api_token:
            headers["Authorization"] = f"Bearer {self.api_token}"
        return headers
    
    def initialize(self) -> bool:
        """
        Initialize the service by warming up the model.
        
        Returns:
            True if successful, False otherwise
        """
        try:
            logger.info(f"Initializing HuggingFace Inference API with model: {self.model_name}")
            
            # Warm up the model with a test request
            test_embedding = self.get_embedding("test initialization")
            
            if test_embedding and len(test_embedding) > 0:
                self._ready = True
                logger.info(f"Embedding service ready. Embedding dimension: {len(test_embedding)}")
                return True
            else:
                self._last_error = "Failed to get test embedding"
                logger.error(self._last_error)
                return False
                
        except Exception as e:
            self._last_error = str(e)
            logger.error(f"Failed to initialize embedding service: {e}")
            return False
    
    @property
    def is_ready(self) -> bool:
        """Check if the service is ready."""
        return self._ready
    
    @property
    def embedding_dimension(self) -> int:
        """Get the embedding dimension for the model."""
        # all-MiniLM-L6-v2 produces 384-dimensional embeddings
        return 384
    
    def get_embedding(self, text: str) -> Optional[List[float]]:
        """
        Get embedding for a single text.
        
        Args:
            text: The text to embed
            
        Returns:
            List of floats representing the embedding, or None on failure
        """
        return self._call_api_with_retry(text)
    
    def get_embeddings_batch(self, texts: List[str]) -> List[Optional[List[float]]]:
        """
        Get embeddings for multiple texts.
        
        Note: HF Inference API processes one at a time on free tier,
        but we batch the requests for cleaner code.
        
        Args:
            texts: List of texts to embed
            
        Returns:
            List of embeddings (some may be None on failure)
        """
        embeddings = []
        for text in texts:
            embedding = self.get_embedding(text)
            embeddings.append(embedding)
        return embeddings
    
    def _call_api_with_retry(self, text: str) -> Optional[List[float]]:
        """
        Call the HuggingFace API with retry logic.
        
        Args:
            text: The text to embed
            
        Returns:
            Embedding vector or None on failure
        """
        for attempt in range(self.max_retries):
            try:
                response = requests.post(
                    self.api_url,
                    headers=self._get_headers(),
                    json={"inputs": text, "options": {"wait_for_model": True}},
                    timeout=60  # Longer timeout for cold starts
                )
                
                if response.status_code == 200:
                    result = response.json()
                    
                    # Handle different response formats
                    if isinstance(result, list):
                        if len(result) > 0:
                            # Could be [[...]] or [...] depending on model
                            if isinstance(result[0], list):
                                # Mean pooling for token embeddings
                                return self._mean_pooling(result)
                            else:
                                return result
                    
                    logger.warning(f"Unexpected response format: {type(result)}")
                    return None
                    
                elif response.status_code == 503:
                    # Model is loading, wait and retry
                    wait_time = response.json().get("estimated_time", self.retry_delay)
                    logger.info(f"Model loading, waiting {wait_time}s...")
                    time.sleep(min(wait_time, 30))  # Cap at 30s
                    continue
                    
                elif response.status_code == 429:
                    # Rate limited
                    logger.warning("Rate limited by HuggingFace API")
                    time.sleep(self.retry_delay * (attempt + 1))
                    continue
                    
                else:
                    logger.error(f"API error {response.status_code}: {response.text}")
                    if attempt < self.max_retries - 1:
                        time.sleep(self.retry_delay)
                    continue
                    
            except requests.exceptions.Timeout:
                logger.warning(f"Request timeout (attempt {attempt + 1}/{self.max_retries})")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay)
                continue
                
            except Exception as e:
                logger.error(f"Request failed: {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay)
                continue
        
        logger.error(f"Failed to get embedding after {self.max_retries} attempts")
        return None
    
    def _mean_pooling(self, token_embeddings: List[List[float]]) -> List[float]:
        """
        Apply mean pooling to token embeddings.
        
        Args:
            token_embeddings: List of token embedding vectors
            
        Returns:
            Single mean-pooled embedding vector
        """
        if not token_embeddings:
            return []
        
        num_tokens = len(token_embeddings)
        embedding_dim = len(token_embeddings[0])
        
        result = [0.0] * embedding_dim
        for token_emb in token_embeddings:
            for i, val in enumerate(token_emb):
                result[i] += val
        
        return [val / num_tokens for val in result]


# Singleton instance
_embedding_service: Optional[EmbeddingService] = None


def get_embedding_service() -> EmbeddingService:
    """Get or create the embedding service singleton."""
    global _embedding_service
    if _embedding_service is None:
        model = os.getenv("EMBEDDING_MODEL", DEFAULT_MODEL)
        _embedding_service = EmbeddingService(model_name=model)
    return _embedding_service
