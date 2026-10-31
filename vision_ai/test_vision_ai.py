"""
Unit Tests for OorNalam AI — Vision AI & Document OCR Specialist
Tests:
1. Document OCR parser on sample Aadhaar and Smart Ration cards
2. High-precision extraction of 8 demographic fields
3. Aadhaar DPDP 2023 number redacting (XXXX-XXXX-1234)
4. Civic hazard classifier & severity tiers (pothole, garbage, sewage)
5. Full DOM input ID match with mock_tnega_portal.html & content.js
"""

import os
import pytest
from pathlib import Path
from vision_ai.evidence_extractor import (
    extract_document_demographics,
    parse_document_ocr,
    redact_aadhaar_number,
    fuse_multimodal_evidence,
    REQUIRED_8_DEMOGRAPHIC_FIELDS
)
from vision_ai.vlm_client import classify_civic_hazard, analyze_civic_image


# Path resolution for sample documents and real images
ROOT_DIR = Path(__file__).resolve().parent.parent
SAMPLE_DOCS_DIRS = [
    ROOT_DIR.parent / "oornalam-extension" / "sample_docs",
    ROOT_DIR / "sample_docs"
]
REAL_IMAGES_DIRS = [
    ROOT_DIR / "real_images",
    ROOT_DIR.parent / "oornalam-extension" / "real_images"
]


def _find_file(filename: str, directories: list) -> Path:
    for d in directories:
        candidate = d / filename
        if candidate.exists():
            return candidate
    return Path(filename)


# =====================================================================
# 1. DPDP 2023 Aadhaar Redacting Tests
# =====================================================================

def test_aadhaar_redacting_standard_space_separated():
    raw = "4829 1049 8291"
    masked = redact_aadhaar_number(raw)
    assert masked == "XXXX-XXXX-8291"
    assert masked.startswith("XXXX-XXXX-")
    assert len(masked) == 14


def test_aadhaar_redacting_hyphen_separated():
    raw = "4829-1049-8291"
    masked = redact_aadhaar_number(raw)
    assert masked == "XXXX-XXXX-8291"


def test_aadhaar_redacting_continuous_digits():
    raw = "482910498291"
    masked = redact_aadhaar_number(raw)
    assert masked == "XXXX-XXXX-8291"


def test_aadhaar_redacting_already_masked():
    raw = "XXXX-XXXX-8291"
    masked = redact_aadhaar_number(raw)
    assert masked == "XXXX-XXXX-8291"


def test_aadhaar_redacting_empty_or_none():
    assert redact_aadhaar_number("") == "XXXX-XXXX-0000"
    assert redact_aadhaar_number(None) == "XXXX-XXXX-0000"


# =====================================================================
# 2. Document OCR Demographic Extraction & 8 Fields Precision
# =====================================================================

def test_extract_demographics_from_sample_aadhaar():
    aadhaar_file = _find_file("sample_aadhaar.png", SAMPLE_DOCS_DIRS)
    data = extract_document_demographics(aadhaar_file, doc_type="aadhaar")

    # Verify 8 Demographic Fields
    for field in REQUIRED_8_DEMOGRAPHIC_FIELDS:
        assert field in data, f"Missing required demographic field: {field}"
        assert data[field], f"Demographic field {field} must not be empty"

    assert data["applicant_name_en"] == "KAVIN S"
    assert data["father_name_en"] == "SURIYAKUMARAN A"
    assert data["community"] in ["MBC", "BC", "SC", "ST", "OC"]
    assert data["sub_caste"] == "Kongu Vellalar"
    assert data["annual_income"] == "72000"
    assert data["door_no"] == "14/B"
    assert data["taluk"] == "Namakkal"
    assert data["district"] == "Namakkal"

    # Verify Aadhaar is masked (Task 3)
    assert data["aadhaar_no"].startswith("XXXX-XXXX-")
    assert data["dpdp_compliance"] == "DPDP_2023_COMPLIANT"
    assert data["precision_score"] >= 0.95


def test_extract_demographics_from_smart_ration_card():
    ration_file = _find_file("sample_smart_ration_card.png", SAMPLE_DOCS_DIRS)
    data = extract_document_demographics(ration_file, doc_type="ration_card")

    assert data["ration_card_no"] == "33/08/042/019284"
    assert data["door_no"] == "14/B"
    assert data["taluk"] == "Namakkal"
    assert data["district"] == "Namakkal"
    assert data["aadhaar_no"].startswith("XXXX-XXXX-")


def test_extract_demographics_from_community_income_cert():
    cert_file = _find_file("sample_community_income_cert.png", SAMPLE_DOCS_DIRS)
    data = extract_document_demographics(cert_file, doc_type="community_income_cert")

    assert data["community"] == "MBC"
    assert data["sub_caste"] == "Kongu Vellalar"
    assert data["annual_income"] == "72000"


# =====================================================================
# 3. Civic Hazard Classification & Severity Tier Tests
# =====================================================================

def test_civic_hazard_classifier_pothole():
    pothole_file = _find_file("pothole_hazard.jpg", REAL_IMAGES_DIRS)
    res = classify_civic_hazard(pothole_file)

    assert res["has_valid_image"] is True
    assert res["visual_category"] == "road_damage"
    assert res["severity_tier"] == "Tier 1 (Critical)"
    assert res["severity"] == "Critical"
    assert res["sla_urgency_hours"] == 24
    assert len(res["visible_evidence"]) >= 2


def test_civic_hazard_classifier_garbage():
    garbage_file = _find_file("garbage_overflow.jpg", REAL_IMAGES_DIRS)
    res = classify_civic_hazard(garbage_file)

    assert res["has_valid_image"] is True
    assert res["visual_category"] == "waste_accumulation"
    assert res["severity_tier"] == "Tier 2 (High)"
    assert res["severity"] == "High"
    assert res["sla_urgency_hours"] == 48
    assert len(res["visible_evidence"]) >= 2


def test_civic_hazard_classifier_sewage():
    sewage_file = _find_file("sewage_overflow.jpg", REAL_IMAGES_DIRS)
    res = classify_civic_hazard(sewage_file)

    assert res["has_valid_image"] is True
    assert res["visual_category"] == "waterlogging_drainage"
    assert res["severity_tier"] == "Tier 1 (Critical)"
    assert res["severity"] == "Critical"
    assert res["sla_urgency_hours"] == 24
    assert len(res["visible_evidence"]) >= 2


# =====================================================================
# 4. DOM ID Match Verification (mock_tnega_portal.html & content.js)
# =====================================================================

def test_dom_input_id_match_tnega():
    """
    Verifies that all demographic keys in the output payload match the exact
    DOM input IDs queried in content.js and mock_tnega_portal.html.
    """
    expected_portal_input_ids = [
        "applicant_name_en",
        "applicant_name_ta",
        "father_name_en",
        "father_name_ta",
        "dob",
        "gender",
        "aadhaar_no",
        "ration_card_no",
        "community",
        "sub_caste",
        "annual_income",
        "income_source",
        "door_no",
        "street_name",
        "village",
        "taluk",
        "district"
    ]

    aadhaar_file = _find_file("sample_aadhaar.png", SAMPLE_DOCS_DIRS)
    extracted = extract_document_demographics(aadhaar_file)

    for field_id in expected_portal_input_ids:
        assert field_id in extracted, f"Output JSON must contain key '{field_id}' matching DOM id #{field_id}"
        assert extracted[field_id] is not None, f"Field '{field_id}' should have a non-null value"


# =====================================================================
# 5. Multimodal Discrepancy & Fusion Regression Tests
# =====================================================================

def test_multimodal_fusion_without_image():
    res = fuse_multimodal_evidence("waste_accumulation", 0.85, None)
    assert res["fused_category"] == "waste_accumulation"
    assert res["overall_confidence"] == 0.85
    assert res["has_discrepancy"] is False


def test_multimodal_fusion_with_matching_image():
    # Pass mock base64 for waste_accumulation
    res = fuse_multimodal_evidence("waste_accumulation", 0.80, "fake_image_base64_data_for_testing_" * 4)
    assert res["fused_category"] == "waste_accumulation"
    assert res["overall_confidence"] > 0.80
    assert res["has_discrepancy"] is False
