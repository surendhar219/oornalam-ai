"""
OorNalam AI — Multimodal Fusion & Discrepancy Detector
Maintained by: TWIN KUMAR S (Vision AI & Multimodal Developer)

Fuses visual observations with text/speech inputs.
Flags cross-modal discrepancies (e.g., photo shows road damage but text mentions garbage).
"""

from typing import Dict, Any, List, Optional
from .vlm_client import analyze_civic_image

def fuse_multimodal_evidence(
    text_category: str,
    text_confidence: float,
    image_base64: Optional[str] = None
) -> Dict[str, Any]:
    """
    Combines text and image signals into a unified evidence package.
    """
    has_image = bool(image_base64 and len(image_base64) > 50)
    
    if not has_image:
        return {
            "fused_category": text_category,
            "overall_confidence": text_confidence,
            "visible_evidence": ["Visual evidence not attached; reported via text/voice."],
            "has_discrepancy": False,
            "clarification_needed": None
        }
        
    vision_res = analyze_civic_image(image_base64, expected_category=text_category)
    visual_category = vision_res.get("visual_category")
    
    # Check for direct discrepancy
    if visual_category and visual_category != text_category:
        return {
            "fused_category": text_category,
            "overall_confidence": 0.60,
            "visible_evidence": vision_res.get("visible_evidence", []),
            "has_discrepancy": True,
            "clarification_needed": (
                f"We noticed a potential discrepancy: your report mentions {text_category.replace('_', ' ')}, "
                f"while the photo indicates {visual_category.replace('_', ' ')}. Please confirm the primary hazard."
            )
        }
        
    # High confidence multimodal fusion
    fused_confidence = min(0.98, text_confidence + 0.15)
    return {
        "fused_category": text_category,
        "overall_confidence": round(fused_confidence, 2),
        "visible_evidence": vision_res.get("visible_evidence", []),
        "has_discrepancy": False,
        "clarification_needed": None
    }
