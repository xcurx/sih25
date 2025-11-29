/**
 * TypeScript client for the Recommendation Engine API
 * Use this in your Next.js application
 */

// Types matching the Python schemas

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: "internship" | "full-time";
  location: string;
  status: "active" | "closed";
  salary?: string;
  requirements: string[];
  eligibleDepartments: string[];
  skillsRequired: string[];
  additionalInfo?: string;
}

export interface RecommendationRequest {
  department: string;
  batch: string;
  skills: string[];
  k?: number;
  job_type?: "internship" | "full-time";
}

export interface Highlights {
  skills: string[];
  department?: string;
  batch?: string;
  requirements: string[];
}

export interface MatchResult {
  job_id: string;
  composite_score: number;
  s_vec: number;
  s_skill: number;
  highlights: Highlights;
  job_type: string;
  location: string;
}

export interface RecommendationResponse {
  recommendations: MatchResult[];
  total_active_jobs: number;
  query_department: string;
  query_batch: string;
}

export interface HealthResponse {
  status: string;
  total_jobs: number;
  active_jobs: number;
  model_loaded: boolean;
}

// API Client Class
export class RecommendationClient {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.RECOMMENDATION_ENGINE_URL || "http://localhost:8000") {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Get health status of the recommendation engine
   */
  async getHealth(): Promise<HealthResponse> {
    return this.fetch<HealthResponse>("/api/health");
  }

  /**
   * Get personalized job recommendations
   */
  async getRecommendations(
    request: RecommendationRequest
  ): Promise<RecommendationResponse> {
    return this.fetch<RecommendationResponse>("/api/recommendations", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  /**
   * Add a new job to the recommendation system
   */
  async addJob(job: Opportunity): Promise<{ success: boolean; message: string; job_id: string }> {
    return this.fetch("/api/jobs", {
      method: "POST",
      body: JSON.stringify(job),
    });
  }

  /**
   * Add multiple jobs at once
   */
  async bulkAddJobs(
    jobs: Opportunity[]
  ): Promise<{ success: boolean; message: string; added_count: number }> {
    return this.fetch("/api/jobs/bulk", {
      method: "POST",
      body: JSON.stringify(jobs),
    });
  }

  /**
   * Update an existing job
   */
  async updateJob(
    jobId: string,
    job: Opportunity
  ): Promise<{ success: boolean; message: string; job_id: string }> {
    return this.fetch(`/api/jobs/${jobId}`, {
      method: "PUT",
      body: JSON.stringify(job),
    });
  }

  /**
   * Remove a job from the recommendation system
   */
  async removeJob(
    jobId: string
  ): Promise<{ success: boolean; message: string; job_id: string }> {
    return this.fetch(`/api/jobs/${jobId}`, {
      method: "DELETE",
    });
  }

  /**
   * Get a specific job by ID
   */
  async getJob(jobId: string): Promise<Opportunity> {
    return this.fetch<Opportunity>(`/api/jobs/${jobId}`);
  }

  /**
   * List all jobs with optional filters
   */
  async listJobs(params?: {
    status_filter?: "active" | "closed";
    job_type?: "internship" | "full-time";
    limit?: number;
  }): Promise<Opportunity[]> {
    const searchParams = new URLSearchParams();
    if (params?.status_filter) searchParams.set("status_filter", params.status_filter);
    if (params?.job_type) searchParams.set("job_type", params.job_type);
    if (params?.limit) searchParams.set("limit", params.limit.toString());

    const query = searchParams.toString();
    return this.fetch<Opportunity[]>(`/api/jobs${query ? `?${query}` : ""}`);
  }
}

// Export a singleton instance
export const recommendationClient = new RecommendationClient();

// React hook example (for use with SWR or React Query)
export function useRecommendationEngine() {
  return {
    client: recommendationClient,
    getRecommendations: recommendationClient.getRecommendations.bind(recommendationClient),
    getHealth: recommendationClient.getHealth.bind(recommendationClient),
    addJob: recommendationClient.addJob.bind(recommendationClient),
    updateJob: recommendationClient.updateJob.bind(recommendationClient),
    removeJob: recommendationClient.removeJob.bind(recommendationClient),
  };
}
