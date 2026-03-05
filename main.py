from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import init_db
from app.api.routes import users, conversations
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Robby - AI Truck Driver Assistant",
    description="Backend API for Robby AI Voice Assistant",
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
@app.on_event("startup")
async def startup():
    logger.info("Starting up Robby Backend...")
    init_db()
    logger.info("Database initialized")

@app.on_event("shutdown")
async def shutdown():
    logger.info("Shutting down Robby Backend...")

# Include routers
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(conversations.router, prefix="/api/v1/conversations", tags=["conversations"])

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Robby Backend"}

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Robby - AI Truck Driver Assistant",
        "version": "0.1.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
