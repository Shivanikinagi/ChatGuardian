from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List, Optional
from datetime import datetime, timedelta

from app.core.database import get_db
from app.models.models import Message, FamilyMember, MessagePriority
from app.services.ai_service import AIService
from app.services.auto_response_service import AutoResponseEngine
from pydantic import BaseModel

router = APIRouter()

# Pydantic schemas
class MessageCreate(BaseModel):
    group_id: str
    sender_phone: str
    content: str
    media_type: Optional[str] = "text"
    media_url: Optional[str] = None

class MessageResponse(BaseModel):
    id: str
    group_id: str
    sender: dict
    content: str
    media_type: str
    timestamp: datetime
    priority: str
    is_read: bool
    ai_classification: dict
    auto_response: Optional[str] = None
    
    class Config:
        from_attributes = True

class MessageFeedback(BaseModel):
    feedback: str  # "correct" or "incorrect"
    correct_priority: Optional[str] = None
    comment: Optional[str] = None

@router.post("/", response_model=MessageResponse)
async def process_message(
    message_data: MessageCreate,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Process a new WhatsApp message through the AI pipeline
    """
    try:
        # Get AI service from app state
        ai_service: AIService = request.app.state.ai_service
        auto_response_engine = AutoResponseEngine()
        
        # Get sender information
        result = await db.execute(
            select(FamilyMember).where(FamilyMember.phone_number == message_data.sender_phone)
        )
        sender = result.scalar_one_or_none()
        
        if not sender:
            # Create new family member if not exists
            sender = FamilyMember(
                name=message_data.sender_phone,  # Will be updated later
                phone_number=message_data.sender_phone,
                importance=5  # Default importance
            )
            db.add(sender)
            await db.flush()
        
        # Prepare sender info for AI
        sender_info = {
            'id': sender.id,
            'name': sender.name,
            'relationship': sender.relationship,
            'generation': sender.generation,
            'importance': sender.importance
        }
        
        # Classify message using AI
        classification = await ai_service.classify_message(
            message_data.content,
            sender_info
        )
        
        # Generate embedding
        embedding = await ai_service.generate_embedding(message_data.content)
        
        # Generate auto-response if needed
        auto_response = None
        if classification.get('needs_response'):
            auto_response = await auto_response_engine.generate_response(
                {'content': message_data.content},
                sender_info,
                classification
            )
        
        # Create message record
        new_message = Message(
            group_id=message_data.group_id,
            sender_id=sender.id,
            content=message_data.content,
            media_type=message_data.media_type,
            media_url=message_data.media_url,
            priority=classification['priority'],
            ai_confidence=classification['confidence'],
            ai_categories=classification['categories'],
            sentiment=classification['sentiment'],
            is_fake_news=classification.get('is_fake_news', False),
            fake_news_score=classification.get('fake_news_score', 0.0),
            needs_response=classification.get('needs_response', False),
            auto_response=auto_response,
            embedding=embedding
        )
        
        db.add(new_message)
        await db.commit()
        await db.refresh(new_message)
        
        # Update sender stats
        sender.message_count += 1
        sender.last_interaction = datetime.utcnow()
        await db.commit()
        
        # Format response
        return MessageResponse(
            id=new_message.id,
            group_id=new_message.group_id,
            sender={
                'id': sender.id,
                'name': sender.name,
                'phone_number': sender.phone_number,
                'relationship': sender.relationship
            },
            content=new_message.content,
            media_type=new_message.media_type,
            timestamp=new_message.timestamp,
            priority=new_message.priority,
            is_read=new_message.is_read,
            ai_classification={
                'confidence': new_message.ai_confidence,
                'categories': new_message.ai_categories,
                'sentiment': new_message.sentiment,
                'is_fake_news': new_message.is_fake_news,
                'needs_response': new_message.needs_response
            },
            auto_response=new_message.auto_response
        )
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")

@router.get("/", response_model=List[MessageResponse])
async def get_messages(
    priority: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    """Get messages with optional filtering"""
    query = select(Message).order_by(desc(Message.timestamp))
    
    if priority:
        query = query.where(Message.priority == priority)
    
    query = query.limit(limit).offset(offset)
    
    result = await db.execute(query)
    messages = result.scalars().all()
    
    # Format responses
    responses = []
    for msg in messages:
        # Get sender
        sender_result = await db.execute(
            select(FamilyMember).where(FamilyMember.id == msg.sender_id)
        )
        sender = sender_result.scalar_one()
        
        responses.append(MessageResponse(
            id=msg.id,
            group_id=msg.group_id,
            sender={
                'id': sender.id,
                'name': sender.name,
                'phone_number': sender.phone_number,
                'relationship': sender.relationship
            },
            content=msg.content,
            media_type=msg.media_type,
            timestamp=msg.timestamp,
            priority=msg.priority,
            is_read=msg.is_read,
            ai_classification={
                'confidence': msg.ai_confidence,
                'categories': msg.ai_categories,
                'sentiment': msg.sentiment,
                'is_fake_news': msg.is_fake_news,
                'needs_response': msg.needs_response
            },
            auto_response=msg.auto_response
        ))
    
    return responses

@router.post("/{message_id}/read")
async def mark_message_read(
    message_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Mark a message as read"""
    result = await db.execute(
        select(Message).where(Message.id == message_id)
    )
    message = result.scalar_one_or_none()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    message.is_read = True
    await db.commit()
    
    return {"status": "success"}

@router.post("/{message_id}/feedback")
async def submit_feedback(
    message_id: str,
    feedback: MessageFeedback,
    db: AsyncSession = Depends(get_db)
):
    """Submit user feedback for AI improvement"""
    from app.models.models import UserFeedback
    
    result = await db.execute(
        select(Message).where(Message.id == message_id)
    )
    message = result.scalar_one_or_none()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    # Store feedback
    user_feedback = UserFeedback(
        message_id=message_id,
        feedback_type=feedback.feedback,
        correct_priority=feedback.correct_priority,
        comment=feedback.comment
    )
    
    db.add(user_feedback)
    await db.commit()
    
    return {"status": "success", "message": "Feedback recorded. AI will learn from this!"}
