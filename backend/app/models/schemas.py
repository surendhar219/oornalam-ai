"""
OoruNalam AI — Pydantic Schemas & Data Contracts
Maintained by: SURENDHAR R (Backend & Database Developer)
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class IntakeRequest(BaseModel):
    text_content: Optional[str] = Field(default=None, description="Citizen typed text")
    voice_transcript: Optional[str] = Field(default=None, description="Speech-to-text transcript")
    image_base64: Optional[str] = Field(default=None, description="Base64 encoded photograph data")
    language_preference: str = Field(default="ta", description="'ta' for Tamil, 'en' for English")

class IntakeResponse(BaseModel):
    complaint_id: str
    detected_category: str
    category_confidence: float
    visible_evidence: List[str]
    extracted_duration: Optional[str] = None
    follow_up_questions: List[Dict[str, str]]
    has_discrepancy: bool = False
    discrepancy_note: Optional[str] = None

class ClarificationSubmitRequest(BaseModel):
    complaint_id: str
    confirmed_category: str
    confirmed_locality: str
    confirmed_duration: Optional[str] = None
    additional_notes: Optional[str] = None

class RoutingResolveRequest(BaseModel):
    category: str
    city: str = "Chennai"
    ward: Optional[str] = None
    landmark: Optional[str] = None

class RoutingResolveResponse(BaseModel):
    is_verified: bool
    confidence_score: float
    corporation: str
    zone_name: str
    zone_number: str
    ward_number: str
    department_name_en: str
    department_name_ta: str
    official_portal_url: str
    helpline_number: str
    sla_days: int
    source_citation: str
    routing_notes: str

class GenerateDraftRequest(BaseModel):
    complaint_id: str
    confirmed_category: str
    confirmed_locality: str
    confirmed_duration: Optional[str] = None
    citizen_name: Optional[str] = None
    citizen_phone: Optional[str] = None

class GrievanceSection(BaseModel):
    title: str
    body: str
    target_department: str
    evidence_summary: str

class GenerateDraftResponse(BaseModel):
    complaint_id: str
    english_draft: GrievanceSection
    tamil_draft: GrievanceSection
    submission_portal_url: str
    helpline_number: str
    status: str
