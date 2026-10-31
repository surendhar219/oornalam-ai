"""
OorNalam AI — Vision AI Package
Exports VLM Civic Hazard Classifier and Document OCR Specialist.
"""

from .vlm_client import analyze_civic_image, classify_civic_hazard
from .evidence_extractor import (
    extract_document_demographics,
    parse_document_ocr,
    redact_aadhaar_number,
    fuse_multimodal_evidence,
    REQUIRED_8_DEMOGRAPHIC_FIELDS
)

__all__ = [
    "analyze_civic_image",
    "classify_civic_hazard",
    "extract_document_demographics",
    "parse_document_ocr",
    "redact_aadhaar_number",
    "fuse_multimodal_evidence",
    "REQUIRED_8_DEMOGRAPHIC_FIELDS"
]
