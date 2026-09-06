"""
Memory Mitra – minimal FastAPI stub.

The main application is a Next.js client-side game (see /app root).
This stub exists so the standard deployment pipeline (which expects
/app/backend with a FastAPI service on :8001) starts cleanly.
It exposes only a couple of harmless /api endpoints.
"""

import os
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Memory Mitra Backend Stub")

api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"service": "memory-mitra-backend-stub", "status": "ok"}


@api_router.get("/health")
async def health():
    return {"status": "healthy"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
