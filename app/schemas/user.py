from pydantic import BaseModel
from typing import Optional, Dict, List
from datetime import datetime

class PersonalityTraits(BaseModel):
    communication_style: str = "neutral"
    humor_level: float = 0.5
    formality: float = 0.5
    preference_detail_level: float = 0.5
    response_speed_preference: str = "normal"
    common_interests: List[str] = []
    tone: str = "professional"

class UserPreferences(BaseModel):
    language: str = "en"
    response_length: str = "medium"
    notification_enabled: bool = True

class UserCreate(BaseModel):
    user_id: str
    name: str
    phone_number: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone_number: Optional[str] = None
    preferences: Optional[UserPreferences] = None

class UserResponse(BaseModel):
    id: int
    user_id: str
    name: str
    phone_number: Optional[str]
    personality_traits: Dict
    total_conversations: int
    total_miles_tracked: float
    created_at: datetime
    last_active: datetime
    
    class Config:
        from_attributes = True
