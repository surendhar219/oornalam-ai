"""
OorNalam AI — Intent & Category Classifier
Maintained by: SELVAGANAPATHI A (AI & NLP Developer)

Classifies Tamil & English citizen complaints into the 3 MVP priority categories.
Supports online Gemini LLM API and offline deterministic heuristic classification.
"""

import os
import re
from typing import Dict, Any, Optional

def classify_complaint_text(text: str) -> Dict[str, Any]:
    """
    Classifies raw citizen text / speech-to-text transcript.
    Returns category, confidence score, and extracted detail signals.
    """
    clean_text = text.lower().strip()
    
    # Keyword signals in English and Tamil
    garbage_keywords = [
        "garbage", "waste", "trash", "dump", "rubbish", "bin", "smell", "odor",
        "குப்பை", "கழிவு", "துர்நாற்றம்", "அழுக்கு", "குப்பைத்தொட்டி", "நாற்றம்"
    ]
    pothole_keywords = [
        "pothole", "road", "crater", "asphalt", "tar", "broken road", "trench",
        "குழி", "சாலை", "பள்ளம்", "ரோடு", "தார்", "சேதம்", "சாலைக்குழி"
    ]
    water_keywords = [
        "drainage", "water", "sewage", "overflow", "stagnant", "gutter", "waterlogging",
        "வடிகால்", "சாக்கடை", "நீர்", "தேங்கி", "மழைநீர்", "கழிவுநீர்", "சாக்கடைநீர்"
    ]
    
    scores = {
        "waste_accumulation": sum(1 for kw in garbage_keywords if kw in clean_text),
        "road_damage": sum(1 for kw in pothole_keywords if kw in clean_text),
        "waterlogging_drainage": sum(1 for kw in water_keywords if kw in clean_text)
    }
    
    best_cat, best_score = max(scores.items(), key=lambda x: x[1])
    
    # If no keywords matched, default to waste_accumulation with low confidence
    if best_score == 0:
        detected_category = "waste_accumulation"
        confidence = 0.50
    else:
        detected_category = best_cat
        confidence = min(0.95, 0.70 + (best_score * 0.08))
        
    # Extract simple duration signal (e.g., '3 days', '3 நாளா')
    duration_match = re.search(r'(\d+)\s*(days?|weeks?|months?|நாளா|நாட்களாக)', clean_text)
    extracted_duration = duration_match.group(0) if duration_match else None
    
    return {
        "category": detected_category,
        "confidence": round(confidence, 2),
        "raw_scores": scores,
        "extracted_duration": extracted_duration
    }
