"""
OoruNalam AI — Locality Routing Engine & Official Portal Registry
Maintained by: SURIYAKUMARAN A (Team Leader & Routing Lead)

Provides verified departmental routing for citizen grievances within verified
demonstration localities, with explicit uncertainty fallbacks for unmapped areas.
"""

import json
import os
from typing import Dict, Any, Optional

DATA_FILE = os.path.join(os.path.dirname(__file__), "gcc_pilot_wards.json")

def load_pilot_dataset() -> Dict[str, Any]:
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def resolve_routing(category: str, city: str = "Chennai", ward: Optional[str] = None, landmark: Optional[str] = None) -> Dict[str, Any]:
    """
    Resolves the responsible public authority based on verified category & locality.
    Never hallucinates unverified departments.
    """
    dataset = load_pilot_dataset()
    category_key = category.lower().strip()
    
    # Map common aliases
    alias_map = {
        "garbage": "waste_accumulation",
        "waste": "waste_accumulation",
        "pothole": "road_damage",
        "road": "road_damage",
        "drainage": "waterlogging_drainage",
        "water": "waterlogging_drainage",
        "stagnant_water": "waterlogging_drainage"
    }
    category_key = alias_map.get(category_key, category_key)
    
    # Search verified wards
    matched_ward = None
    if ward:
        clean_ward = ward.lower().replace("ward", "").strip()
        for w in dataset["verified_wards"]:
            if w["ward_number"] == clean_ward:
                matched_ward = w
                break
                
    # Search by landmark if ward was not directly found
    if not matched_ward and landmark:
        landmark_clean = landmark.lower()
        for w in dataset["verified_wards"]:
            for loc in w["locality_names"]:
                if loc.lower() in landmark_clean or landmark_clean in loc.lower():
                    matched_ward = w
                    break
            if matched_ward:
                break

    # If verified ward and category found
    if matched_ward and category_key in matched_ward["departments"]:
        dept_info = matched_ward["departments"][category_key]
        return {
            "is_verified": True,
            "confidence_score": 0.95,
            "corporation": dataset["corporation_name"],
            "zone_name": matched_ward["zone_name"],
            "zone_number": matched_ward["zone_number"],
            "ward_number": matched_ward["ward_number"],
            "department_name_en": dept_info["department_name_en"],
            "department_name_ta": dept_info["department_name_ta"],
            "official_portal_url": dept_info["official_portal_url"],
            "helpline_number": dept_info["helpline"],
            "sla_days": dept_info["sla_days"],
            "source_citation": dept_info["source"],
            "routing_notes": f"Verified match: Ward {matched_ward['ward_number']} ({matched_ward['zone_name']}) maps directly to {dept_info['department_name_en']}."
        }

    # Fallback when exact authority cannot be verified
    fallback = dataset["state_fallback"]
    return {
        "is_verified": False,
        "confidence_score": 0.50,
        "corporation": "Unverified pilot boundary",
        "zone_name": "Unspecified Zone",
        "zone_number": "N/A",
        "ward_number": ward or "Unspecified",
        "department_name_en": fallback["name_en"],
        "department_name_ta": fallback["name_ta"],
        "official_portal_url": fallback["official_portal_url"],
        "helpline_number": fallback["helpline"],
        "sla_days": 7,
        "source_citation": "Tamil Nadu State e-Governance Portal",
        "routing_notes": "Locality is outside verified pilot database. Escalated to Tamil Nadu CM Helpline (Mudhalvarin Mugavari) official portal."
    }

def get_verified_wards() -> list:
    dataset = load_pilot_dataset()
    return dataset.get("verified_wards", [])
