"""
E2E Integration & Verification Tests for OorNalam Routing
Lead & Author: SURIYAKUMARAN A (Routing, Testing & Lead)
"""

import pytest
from routing_data.portal_registry import resolve_routing, get_verified_wards

def test_load_verified_wards():
    wards = get_verified_wards()
    assert len(wards) >= 3
    ward_numbers = [w["ward_number"] for w in wards]
    assert "114" in ward_numbers
    assert "117" in ward_numbers
    assert "173" in ward_numbers

def test_garbage_routing_ward_114():
    """Scenario 1: Garbage pile in T. Nagar (Ward 114) -> GCC Zone 10 SWM"""
    result = resolve_routing(category="waste_accumulation", ward="114")
    assert result["is_verified"] is True
    assert result["zone_name"] == "Kodambakkam"
    assert "Solid Waste Management" in result["department_name_en"]
    assert "1913" in result["helpline_number"]
    assert result["confidence_score"] >= 0.90

def test_pothole_routing_by_landmark():
    """Scenario 2: Pothole near Usman Road -> Matched to Ward 114 Road Works"""
    result = resolve_routing(category="road_damage", landmark="Near Usman Road bus stop")
    assert result["is_verified"] is True
    assert result["ward_number"] == "114"
    assert "Roads" in result["department_name_en"] or "Works" in result["department_name_en"]

def test_drainage_routing_ward_173():
    """Scenario 3: Drainage overflow in Adyar (Ward 173) -> CMWSSB Area 13"""
    result = resolve_routing(category="waterlogging_drainage", ward="173")
    assert result["is_verified"] is True
    assert "CMWSSB" in result["department_name_en"]
    assert result["zone_name"] == "Adyar"

def test_unverified_locality_fallback():
    """Scenario 4: Out-of-bounds area -> Transparent fallback to CM Helpline"""
    result = resolve_routing(category="road_damage", ward="999", landmark="Unknown distant village")
    assert result["is_verified"] is False
    assert result["confidence_score"] <= 0.60
    assert "Mudhalvarin Mugavari" in result["department_name_en"] or "CM Helpline" in result["department_name_en"]
    assert "1100" in result["helpline_number"]

if __name__ == "__main__":
    pytest.main(["-v", __file__])
