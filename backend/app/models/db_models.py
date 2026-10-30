"""
OoruNalam AI — SQLite Database Layer
Maintained by: SURENDHAR R (Backend & Database Developer)
"""

import sqlite3
import os
import json
from datetime import datetime
from typing import Optional, Dict, Any

DB_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "oorunalam.db")

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS complaints (
        id TEXT PRIMARY KEY,
        created_at TEXT,
        text_content TEXT,
        voice_transcript TEXT,
        has_image INTEGER,
        detected_category TEXT,
        confidence_score REAL,
        confirmed_locality TEXT,
        confirmed_duration TEXT,
        target_department TEXT,
        status TEXT,
        draft_payload TEXT
    )
    """)
    conn.commit()
    conn.close()

def save_complaint(
    complaint_id: str,
    text_content: Optional[str],
    voice_transcript: Optional[str],
    has_image: bool,
    detected_category: str,
    confidence_score: float
):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO complaints 
    (id, created_at, text_content, voice_transcript, has_image, detected_category, confidence_score, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        complaint_id,
        datetime.utcnow().isoformat(),
        text_content,
        voice_transcript,
        1 if has_image else 0,
        detected_category,
        confidence_score,
        "INTAKE_PROCESSED"
    ))
    conn.commit()
    conn.close()

def update_complaint_draft(
    complaint_id: str,
    confirmed_locality: str,
    confirmed_duration: str,
    target_department: str,
    draft_dict: Dict[str, Any]
):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE complaints 
    SET confirmed_locality = ?, confirmed_duration = ?, target_department = ?, status = ?, draft_payload = ?
    WHERE id = ?
    """, (
        confirmed_locality,
        confirmed_duration,
        target_department,
        "READY_FOR_OFFICIAL_HANDOFF",
        json.dumps(draft_dict),
        complaint_id
    ))
    conn.commit()
    conn.close()

def get_complaint(complaint_id: str) -> Optional[Dict[str, Any]]:
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM complaints WHERE id = ?", (complaint_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    return {
        "id": row[0],
        "created_at": row[1],
        "text_content": row[2],
        "voice_transcript": row[3],
        "has_image": bool(row[4]),
        "detected_category": row[5],
        "confidence_score": row[6],
        "confirmed_locality": row[7],
        "confirmed_duration": row[8],
        "target_department": row[9],
        "status": row[10],
        "draft_payload": json.loads(row[11]) if row[11] else None
    }
