from fastapi import APIRouter
from app.api.v1.endpoints import messages, family, analytics, notifications

api_router = APIRouter()

api_router.include_router(messages.router, prefix="/messages", tags=["messages"])
api_router.include_router(family.router, prefix="/family", tags=["family"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
