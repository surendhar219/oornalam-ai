"""
OorNalam AI — Adaptive Grievance Completeness Engine (AGCE)
Maintained by: SELVAGANAPATHI A (AI & NLP Developer) & SURIYAKUMARAN A (Team Lead)

Core Innovation:
Instead of subjecting citizens to a static 15-field bureaucratic form,
the AGCE dynamically evaluates 5 critical questions:
1. What information is already available? (Audio transcript, image metadata, GPS)
2. What can be inferred reliably? (VLM physical hazards, severity, day/night)
3. What needs citizen confirmation? (High-stakes safety or routing ambiguities)
4. What is mandatory for the selected portal? (Target department specific constraints)
5. Is the complaint sufficiently clear to file? (Dynamic Completeness Score: 0-100%)

Result: The citizen experiences a 15-second natural conversation, not a government form.
"""

from typing import Dict, Any, List, Optional
import math

# Portal-specific mandatory field definitions
PORTAL_MANDATORY_FIELDS = {
    "CMWSSB": {
        "required": ["sewage_vs_water", "locality_or_ward"],
        "high_priority_confirmations": ["entering_houses_or_shops"],
        "display_name": "Chennai Metro Water (CMWSSB 1916)"
    },
    "GCC_SWM": {
        "required": ["garbage_location", "locality_or_ward"],
        "high_priority_confirmations": ["days_uncollected", "blocking_thoroughfare"],
        "display_name": "GCC Solid Waste Management (1913)"
    },
    "TANGEDCO": {
        "required": ["electrical_hazard_type", "locality_or_ward"],
        "high_priority_confirmations": ["touching_ground_or_people", "sparking_or_live"],
        "display_name": "TANGEDCO Power Distribution (1912)"
    },
    "GCC_ROADS": {
        "required": ["road_damage_type", "locality_or_ward"],
        "high_priority_confirmations": ["two_wheeler_skid_hazard", "depth_estimate"],
        "display_name": "GCC Bus Route Roads / PWD"
    },
    "DEFAULT": {
        "required": ["issue_category", "locality_or_ward"],
        "high_priority_confirmations": ["severity_impact"],
        "display_name": "Municipal Civic Desk"
    }
}

class AdaptiveGrievanceCompletenessEngine:
    """
    Dynamically orchestrates multimodal intake data to eliminate form fatigue.
    """
    def __init__(self):
        self.portal_registry = PORTAL_MANDATORY_FIELDS

    def evaluate_completeness(
        self,
        voice_transcript: Optional[str] = None,
        text_content: Optional[str] = None,
        image_metadata: Optional[Dict[str, Any]] = None,
        vlm_evidence: Optional[Dict[str, Any]] = None,
        target_department: str = "DEFAULT",
        user_responses: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Executes the 5-point Adaptive Completeness evaluation.
        """
        user_responses = user_responses or {}
        image_metadata = image_metadata or {}
        vlm_evidence = vlm_evidence or {}
        full_text = f"{voice_transcript or ''} {text_content or ''}".lower()

        # -------------------------------------------------------------
        # 1. WHAT INFORMATION IS ALREADY AVAILABLE?
        # -------------------------------------------------------------
        available_info = {}
        if voice_transcript or text_content:
            available_info["raw_text_provided"] = True
            available_info["text_word_count"] = len(full_text.split())
        
        # Check for landmark or locality in text/audio
        common_landmarks = [
            "road", "street", "nagar", "bus stop", "school", "hospital", 
            "temple", "junction", "salem", "namakkal", "karur", "anna nagar",
            "t nagar", "adyar", "ward", "ரோடு", "தெரு", "நகர்", "பள்ளி"
        ]
        detected_landmark = None
        for lm in common_landmarks:
            if lm in full_text:
                detected_landmark = lm
                break
        if detected_landmark or user_responses.get("locality"):
            available_info["locality_detected"] = user_responses.get("locality") or detected_landmark

        if image_metadata.get("has_image") or vlm_evidence.get("has_image"):
            available_info["visual_evidence_present"] = True
            available_info["image_timestamp"] = image_metadata.get("timestamp", "Current Session")

        # -------------------------------------------------------------
        # 2. WHAT CAN BE INFERRED RELIABLY? (Vision + Context)
        # -------------------------------------------------------------
        inferred_info = {}
        # Inferred from VLM
        if vlm_evidence:
            inferred_info["visual_hazard_class"] = vlm_evidence.get("hazard_class", "Civic Obstruction")
            inferred_info["severity_tier"] = vlm_evidence.get("severity_tier", "NORMAL")
            inferred_info["lighting_condition"] = vlm_evidence.get("lighting", "Daylight")
            inferred_info["water_stagnation_depth"] = vlm_evidence.get("depth_level", "Medium")
        else:
            # Fallback inferences from text keywords
            if any(k in full_text for k in ["சாக்கடை", "sewage", "கழிவுநீர்"]):
                inferred_info["visual_hazard_class"] = "Sewage Overflow"
                inferred_info["severity_tier"] = "HIGH"
            elif any(k in full_text for k in ["குப்பை", "garbage", "trash"]):
                inferred_info["visual_hazard_class"] = "Garbage Accumulation"
                inferred_info["severity_tier"] = "NORMAL"
            elif any(k in full_text for k in ["கம்பி", "wire", "மின்சாரம்"]):
                inferred_info["visual_hazard_class"] = "Exposed Electrical Wire"
                inferred_info["severity_tier"] = "CRITICAL"

        # -------------------------------------------------------------
        # 3. WHAT IS MANDATORY FOR THE SELECTED PORTAL?
        # -------------------------------------------------------------
        portal_rules = self.portal_registry.get(target_department, self.portal_registry["DEFAULT"])
        mandatory_checklist = portal_rules["required"]
        high_priority_checks = portal_rules["high_priority_confirmations"]

        satisfied_mandatory = []
        missing_mandatory = []

        for req in mandatory_checklist:
            if req in ["sewage_vs_water", "garbage_location", "electrical_hazard_type", "road_damage_type", "issue_category"]:
                if inferred_info.get("visual_hazard_class"):
                    satisfied_mandatory.append(req)
                else:
                    missing_mandatory.append(req)
            elif req == "locality_or_ward":
                if available_info.get("locality_detected"):
                    satisfied_mandatory.append(req)
                else:
                    missing_mandatory.append(req)

        # -------------------------------------------------------------
        # 4. WHAT NEEDS CITIZEN CONFIRMATION?
        # -------------------------------------------------------------
        needs_confirmation = None
        # We pick EXACTLY ONE high-impact question if not already confirmed
        for check in high_priority_checks:
            if check not in user_responses:
                if check == "entering_houses_or_shops":
                    needs_confirmation = {
                        "id": "entering_houses_or_shops",
                        "field": "house_intrusion",
                        "question_en": "Is sewage entering or threatening to enter houses or shops?",
                        "question_ta": "கழிவுநீர் வீடுகளுக்குள் அல்லது கடைகளுக்குள் நுழைகிறதா?",
                        "quick_options": ["Yes, entering homes", "On the street only", "Near a school/hospital"],
                        "impact": "Escalates dispatch from 24h to 2h response SLA"
                    }
                    break
                elif check == "touching_ground_or_people":
                    needs_confirmation = {
                        "id": "touching_ground_or_people",
                        "field": "ground_contact",
                        "question_en": "Is the snapped wire within arm's reach of pedestrians or touching the ground?",
                        "question_ta": "அறுந்து விழுந்த மின் கம்பி தரை மட்டத்தில் அல்லது பொதுமக்கள் தொடும் உயரத்தில் உள்ளதா?",
                        "quick_options": ["Yes, dangerous touch height", "Hanging overhead", "Sparking"],
                        "impact": "Triggers immediate TANGEDCO 1912 emergency siren dispatch"
                    }
                    break
                elif check == "days_uncollected":
                    needs_confirmation = {
                        "id": "days_uncollected",
                        "field": "uncollected_duration",
                        "question_en": "How many days has this garbage remained uncollected?",
                        "question_ta": "இந்த குப்பை எத்தனை நாட்களாக அகற்றப்படாமல் உள்ளது?",
                        "quick_options": ["1-2 Days", "3-5 Days (Overflowing)", "Over 1 Week"],
                        "impact": "Establishes breach of Municipal Solid Waste 24hr mandate"
                    }
                    break
                elif check == "two_wheeler_skid_hazard":
                    needs_confirmation = {
                        "id": "two_wheeler_skid_hazard",
                        "field": "traffic_hazard",
                        "question_en": "Is the road crater causing sudden braking or bike skidding?",
                        "question_ta": "இந்த பள்ளம் இருசக்கர வாகனங்கள் சறுக்கி விழும் ஆபத்தை ஏற்படுத்துகிறதா?",
                        "quick_options": ["Yes, acute skid zone", "Moderate bump", "Affecting heavy vehicles"],
                        "impact": "Elevates priority on bus route and school access roads"
                    }
                    break

        # -------------------------------------------------------------
        # 5. IS THE COMPLAINT SUFFICIENTLY CLEAR TO FILE? (Dynamic Score)
        # -------------------------------------------------------------
        score = 0
        # Text/Voice input: up to 30 pts
        if available_info.get("raw_text_provided"):
            score += min(30, available_info.get("text_word_count", 0) * 3 + 10)
        # Visual evidence: 25 pts
        if available_info.get("visual_evidence_present"):
            score += 25
        # Reliable Locality: 25 pts
        if available_info.get("locality_detected"):
            score += 25
        # User confirmation on high-stakes query: 20 pts
        if user_responses:
            score += 20

        # Cap score at 100
        score = min(100, score)
        is_filing_ready = (score >= 80 and len(missing_mandatory) == 0)

        return {
            "completeness_score": score,
            "is_filing_ready": is_filing_ready,
            "target_portal": portal_rules["display_name"],
            "step_breakdown": {
                "available_data": available_info,
                "inferred_reliably": inferred_info,
                "mandatory_satisfied": satisfied_mandatory,
                "mandatory_missing": missing_mandatory,
                "citizen_confirmation_needed": needs_confirmation
            },
            "user_experience_note": (
                "100% Portal-Ready Formal Draft Unlocked." if is_filing_ready
                else "1 Micro-Confirmation Needed to Reach 100% Filing Readiness."
            )
        }

# Global instance
completeness_engine = AdaptiveGrievanceCompletenessEngine()
