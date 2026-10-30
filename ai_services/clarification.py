"""
OoruNalam AI — Conversational Clarification & Follow-Up Engine
Maintained by: SELVAGANAPATHI A (AI & NLP Developer)

Identifies missing critical complaint dimensions (Locality, Duration, Severity)
and generates bilingual follow-up prompts to ensure complaint completeness.
"""

from typing import Dict, Any, List, Optional

def generate_follow_up_questions(
    category: str,
    extracted_locality: Optional[str] = None,
    extracted_duration: Optional[str] = None,
    language_pref: str = "ta"
) -> List[Dict[str, str]]:
    """
    Generates targeted follow-up prompts if key fields are missing.
    """
    questions = []
    
    # 1. Locality is mandatory for verified routing
    if not extracted_locality:
        questions.append({
            "id": "q_locality",
            "field": "locality",
            "question_en": "Please confirm your locality, nearby landmark, or Corporation Ward number.",
            "question_ta": "தயவுசெய்து உங்கள் பகுதி, அருகிலுள்ள அடையாளம் அல்லது வார்டு எண்ணை குறிப்பிடவும்.",
            "placeholder_en": "e.g., Near Usman Road bus stop, Ward 114",
            "placeholder_ta": "எ.கா: உஸ்மான் ரோடு பேருந்து நிறுத்தம் அருகில், வார்டு 114"
        })
        
    # 2. Duration gives administrative urgency context
    if not extracted_duration:
        questions.append({
            "id": "q_duration",
            "field": "duration",
            "question_en": "How many days has this issue been persisting?",
            "question_ta": "இந்த பிரச்சனை எத்தனை நாட்களாக நீடிக்கிறது?",
            "placeholder_en": "e.g., 3 days, 1 week",
            "placeholder_ta": "எ.கா: 3 நாட்களாக, 1 வாரமாக"
        })
        
    # 3. Category specific nuance
    if category == "road_damage":
        questions.append({
            "id": "q_traffic_hazard",
            "field": "traffic_impact",
            "question_en": "Is the pothole posing an immediate hazard to two-wheelers or school buses?",
            "question_ta": "இந்த சாலைக்குழி இருசக்கர வாகனங்கள் அல்லது பொதுமக்களுக்கு ஆபத்தாக உள்ளதா?",
            "placeholder_en": "Yes / High traffic street",
            "placeholder_ta": "ஆம் / அதிக போக்குவரத்து உள்ள சாலை"
        })
        
    return questions
