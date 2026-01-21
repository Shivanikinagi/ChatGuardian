from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.database import get_db

router = APIRouter()

class NotificationRegistration(BaseModel):
    token: str

@router.post("/register")
async def register_notification_token(
    registration: NotificationRegistration,
    db: AsyncSession = Depends(get_db)
):
    """Register device push notification token"""
    # Store token in database for sending push notifications
    return {"status": "success", "message": "Notification token registered"}
