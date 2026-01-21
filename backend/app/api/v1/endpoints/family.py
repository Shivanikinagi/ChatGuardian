from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from pydantic import BaseModel

from app.core.database import get_db
from app.models.models import FamilyMember

router = APIRouter()

class FamilyMemberResponse(BaseModel):
    id: str
    name: str
    phone_number: str
    relationship: str
    generation: int
    importance: int
    message_count: int
    health_tracking_enabled: bool
    
    class Config:
        from_attributes = True

@router.get("/", response_model=dict)
async def get_family_data(db: AsyncSession = Depends(get_db)):
    """Get all family members and relationship map"""
    result = await db.execute(select(FamilyMember))
    members = result.scalars().all()
    
    return {
        "members": [
            FamilyMemberResponse.model_validate(member)
            for member in members
        ],
        "relationships": []  # Will be populated by graph analysis
    }

@router.post("/members", response_model=FamilyMemberResponse)
async def create_family_member(
    name: str,
    phone_number: str,
    relationship: str = "",
    db: AsyncSession = Depends(get_db)
):
    """Add a new family member"""
    member = FamilyMember(
        name=name,
        phone_number=phone_number,
        relationship=relationship
    )
    
    db.add(member)
    await db.commit()
    await db.refresh(member)
    
    return FamilyMemberResponse.model_validate(member)
