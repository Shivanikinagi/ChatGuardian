from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1 import api_router
from app.services.ai_service import AIService
from app.services.websocket_service import WebSocketManager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    logger.info("Starting ChatGuardian Backend...")
    
    # Initialize database
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Initialize AI models
    ai_service = AIService()
    await ai_service.load_models()
    app.state.ai_service = ai_service
    
    # Initialize WebSocket manager
    app.state.ws_manager = WebSocketManager()
    
    logger.info("ChatGuardian Backend started successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down ChatGuardian Backend...")
    await ai_service.cleanup()

# Create FastAPI app
app = FastAPI(
    title="ChatGuardian API",
    description="AI-powered WhatsApp family chat assistant",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Include routers
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "ChatGuardian API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "ai_models_loaded": hasattr(app.state, 'ai_service'),
        "websocket_ready": hasattr(app.state, 'ws_manager')
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
