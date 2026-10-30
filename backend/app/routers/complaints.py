"""
OorNalam AI — Complaints REST Router
Maintained by: SURENDHAR R (Backend & Database Developer)
"""

import uuid
import sys
import os
from fastapi import APIRouter, HTTPException

# Ensure sibling directories are importable
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from ai_services.nlp_classifier import classify_complaint_text
from ai_services.clarification import generate_follow_up_questions
from ai_services.grievance_drafter import draft_formal_grievance
from vision_ai.evidence_extractor import fuse_multimodal_evidence
from routing_data.portal_registry import resolve_routing

from backend.app.models.schemas import (
    IntakeRequest, IntakeResponse,
    GenerateDraftRequest, GenerateDraftResponse, GrievanceSection
)
from backend.app.models.db_models import save_complaint, update_complaint_draft, get_complaint

router = APIRouter(prefix="/api/complaints", tags=["Complaints"])

@router.post("/analyze", response_model=IntakeResponse)
def analyze_grievance_intake(request: IntakeRequest):
    """
    Intake multimodal citizen input (text, voice, photo).
    Performs NLP classification, VLM evidence extraction, and follow-up question formulation.
    """
    complaint_id = f"ON-{uuid.uuid4().hex[:8].upper()}"
    combined_text = f"{request.text_content or ''} {request.voice_transcript or ''}".strip()
    
    # 1. NLP Text Classification
    nlp_res = classify_complaint_text(combined_text)
    category = nlp_res["category"]
    confidence = nlp_res["confidence"]
    duration = nlp_res["extracted_duration"]
    
    # 2. Vision Multimodal Fusion
    fused_res = fuse_multimodal_evidence(
        text_category=category,
        text_confidence=confidence,
        image_base64=request.image_base64
    )
    
    # 3. Follow-up Formulation
    follow_ups = generate_follow_up_questions(
        category=fused_res["fused_category"],
        extracted_duration=duration,
        language_pref=request.language_preference
    )
    
    # 4. Save initial state in SQLite
    save_complaint(
        complaint_id=complaint_id,
        text_content=request.text_content,
        voice_transcript=request.voice_transcript,
        has_image=bool(request.image_base64),
        detected_category=fused_res["fused_category"],
        confidence_score=fused_res["overall_confidence"]
    )
    
    return IntakeResponse(
        complaint_id=complaint_id,
        detected_category=fused_res["fused_category"],
        category_confidence=fused_res["overall_confidence"],
        visible_evidence=fused_res["visible_evidence"],
        extracted_duration=duration,
        follow_up_questions=follow_ups,
        has_discrepancy=fused_res["has_discrepancy"],
        discrepancy_note=fused_res["clarification_needed"]
    )

@router.post("/generate-draft", response_model=GenerateDraftResponse)
def generate_draft(request: GenerateDraftRequest):
    """
    Synthesizes formal bilingual grievance document and links to official portal.
    """
    # 1. Resolve official routing
    routing_info = resolve_routing(
        category=request.confirmed_category,
        landmark=request.confirmed_locality
    )
    
    dept_name = routing_info["department_name_en"]
    portal_url = routing_info["official_portal_url"]
    helpline = routing_info["helpline_number"]
    
    # 2. Generate drafts
    drafts = draft_formal_grievance(
        category=request.confirmed_category,
        locality=request.confirmed_locality,
        visible_evidence=["Documented physical civic hazard at confirmed location"],
        duration=request.confirmed_duration,
        recommended_dept=dept_name,
        helpline=helpline
    )
    
    # 3. Update database record
    update_complaint_draft(
        complaint_id=request.complaint_id,
        confirmed_locality=request.confirmed_locality,
        confirmed_duration=request.confirmed_duration or "Recent",
        target_department=dept_name,
        draft_dict=drafts
    )
    
    return GenerateDraftResponse(
        complaint_id=request.complaint_id,
        english_draft=GrievanceSection(**drafts["english"]),
        tamil_draft=GrievanceSection(**drafts["tamil"]),
        submission_portal_url=portal_url,
        helpline_number=helpline,
        status="READY_FOR_OFFICIAL_HANDOFF"
    )

@router.get("/{complaint_id}")
def fetch_complaint_status(complaint_id: str):
    complaint = get_complaint(complaint_id)
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint record not found")
    return complaint
