"""
OorNalam AI — FastAPI Application Entrypoint
Byte Breakers Software Division (Team ID: AARVAM-S-0004)
Maintained by: SURENDHAR R (Backend & Database Developer)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.models.db_models import init_db
from backend.app.routers.complaints import router as complaints_router
from backend.app.routers.routing import router as routing_router

# Initialize SQLite tables on startup
init_db()

app = FastAPI(
    title="OorNalam AI Backend API",
    description="Multimodal Community Grievance Intake, Intelligence, and Official Routing Engine",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(complaints_router)
app.include_router(routing_router)

@app.get("/")
def root():
    return {
        "project": "OorNalam AI",
        "team": "Byte Breakers",
        "team_id": "AARVAM-S-0004",
        "status": "online",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "sqlite_connected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
