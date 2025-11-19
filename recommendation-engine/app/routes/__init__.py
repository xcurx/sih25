from app.routes.jobs import router as jobs_router
from app.routes.recommendations import router as recommendations_router
from app.routes.resume import router as resume_router
from app.routes.health import router as health_router

__all__ = ["jobs_router", "recommendations_router", "resume_router", "health_router"]
