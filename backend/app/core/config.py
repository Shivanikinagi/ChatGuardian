from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "ChatGuardian"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:8081",
        "http://localhost:19006",
        "exp://localhost:8081",
    ]
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://chatguardian:password@localhost:5432/chatguardian"
    )
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Celery
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/1")
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/2")
    
    # AI Model Settings
    AI_MODEL_PATH: str = "./models"
    HUGGINGFACE_TOKEN: str = os.getenv("HUGGINGFACE_TOKEN", "")
    
    # Text Classification Model
    TEXT_CLASSIFIER_MODEL: str = "microsoft/phi-3-mini-4k-instruct"
    EMBEDDINGS_MODEL: str = "BAAI/bge-small-en-v1.5"
    
    # Vision Model
    VISION_MODEL: str = "apple/mobilevit-small"
    
    # Audio Model
    AUDIO_MODEL: str = "openai/whisper-tiny"
    
    # Fake News Detection
    FACT_CHECK_API_KEY: str = os.getenv("FACT_CHECK_API_KEY", "")
    
    # OpenAI (for complex reasoning)
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # File Storage
    STORAGE_PATH: str = "./storage"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10 MB
    
    # Message Processing
    MESSAGE_BATCH_SIZE: int = 50
    PROCESSING_TIMEOUT: int = 30
    
    # Emergency Detection Thresholds
    EMERGENCY_CONFIDENCE_THRESHOLD: float = 0.85
    IMPORTANT_CONFIDENCE_THRESHOLD: float = 0.70
    FAKE_NEWS_THRESHOLD: float = 0.75
    
    # Monitoring
    SENTRY_DSN: str = os.getenv("SENTRY_DSN", "")
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
