from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class MessageCreate(BaseModel):
    content: str
    role: str  # "user" or "assistant"

class MessageResponse(BaseModel):
    id: int
    message_id: str
    role: str
    content: str
    sentiment: str
    emotion: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class ConversationCreate(BaseModel):
    title: Optional[str] = None

class ConversationUpdate(BaseModel):
    title: Optional[str] = None

class ConversationResponse(BaseModel):
    id: int
    conversation_id: str
    user_id: str
    title: Optional[str]
    total_messages: int
    total_turns: int
    sentiment: str
    topics: List[str]
    keywords: List[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ConversationDetailResponse(ConversationResponse):
    messages: List[MessageResponse]