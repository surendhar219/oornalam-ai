"""
OoruNalam AI — Formal Bilingual Grievance Drafter
Maintained by: SELVAGANAPATHI A (AI & NLP Developer)

Generates official administrative petitions in English and Tamil
following standard municipal grievance formatting protocols.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime

def draft_formal_grievance(
    category: str,
    locality: str,
    visible_evidence: List[str],
    duration: Optional[str] = None,
    additional_notes: Optional[str] = None,
    recommended_dept: Optional[str] = None,
    helpline: Optional[str] = None
) -> Dict[str, Any]:
    """
    Synthesizes a structured bilingual complaint document ready for citizen sign-off.
    """
    evidence_str_en = ", ".join(visible_evidence) if visible_evidence else "Visible civic hazard documented in attached photographic evidence."
    evidence_str_ta = "இணைக்கப்பட்டுள்ள புகைப்படத்தில் காணப்படும் பொது இடத்திற்கான இடர்பாடுகள்."
    duration_en = duration if duration else "Several days"
    duration_ta = duration if duration else "பல நாட்களாக"
    dept_en = recommended_dept or "Concerned Municipal Authority"
    
    # Category Labels
    titles_en = {
        "waste_accumulation": "Urgent Petition: Clearance of Uncollected Solid Waste Accumulation",
        "road_damage": "Grievance: Hazardous Pothole and Road Damage Repair Request",
        "waterlogging_drainage": "Urgent Request: Drainage Overflow and Stagnant Water Remediation"
    }
    
    titles_ta = {
        "waste_accumulation": "அவசர மனு: தேங்கியுள்ள குப்பைகளை உடனடியாக அகற்றுதல் தொடர்பாக",
        "road_damage": "புகார் மனு: ஆபத்தான சாலைக்குழியை சீரமைக்கக் கோருதல்",
        "waterlogging_drainage": "அவசர மனு: கழிவுநீர் தேங்குதல் மற்றும் வடிகால் அடைப்பை சரிசெய்தல்"
    }
    
    title_en = titles_en.get(category, "Public Grievance Redressal Petition")
    title_ta = titles_ta.get(category, "பொதுக் குறைதீர்ப்பு விண்ணப்பம்")
    
    # English Body
    body_en = (
        f"To:\n{dept_en}\n\n"
        f"Respected Officer,\n\n"
        f"I am writing as a responsible resident to bring to your immediate attention a public infrastructure issue at: {locality}.\n\n"
        f"Problem Summary: {title_en}.\n"
        f"Observed Evidence: {evidence_str_en}\n"
        f"Duration of Persistence: {duration_en}.\n\n"
        f"This condition causes significant inconvenience and hygiene/safety hazards to pedestrians, commuters, and nearby residents. "
        f"I kindly request the department to inspect the site and initiate timely remediation.\n\n"
        f"Date of Report: {datetime.now().strftime('%Y-%m-%d')}\n"
        f"Prepared via OoruNalam Civic Intelligence Assistant."
    )
    
    # Tamil Body
    body_ta = (
        f"பெறுநர்:\n{dept_en}\n\n"
        f"மதிப்பிற்குரிய அதிகாரி அவர்களுக்கு,\n\n"
        f"பொருள்: {title_ta} - நடவடிக்கை எடுக்க வேண்டுதல்.\n\n"
        f"எங்கள் பகுதியில் ({locality}) மேற்கண்ட பிரச்சனை {duration_ta} நீடித்து வருகிறது. "
        f"ஆதார விபரம்: {evidence_str_ta}\n\n"
        f"இதனால் பொதுமக்கள், பள்ளி குழந்தைகள் மற்றும் வாகன ஓட்டிகள் பெரும் சிரமத்திற்கு ஆளாகின்றனர். "
        f"ஆகவே, பொது நலன் கருதி தாங்கள் உடனடியாக ஆய்வு செய்து உரிய நடவடிக்கை எடுக்குமாறு பணிவுடன் கேட்டுக்கொள்கிறேன்.\n\n"
        f"தேதி: {datetime.now().strftime('%Y-%m-%d')}\n"
        f"ஊருநலம் (OoruNalam AI) செயலி மூலம் உருவாக்கப்பட்டது."
    )
    
    return {
        "english": {
            "title": title_en,
            "body": body_en,
            "target_department": dept_en,
            "evidence_summary": evidence_str_en
        },
        "tamil": {
            "title": title_ta,
            "body": body_ta,
            "target_department": dept_en,
            "evidence_summary": evidence_str_ta
        }
    }
