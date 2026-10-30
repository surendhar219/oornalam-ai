"""
OoruNalam AI — Locality Routing REST Router
Maintained by: SURENDHAR R (Backend & Database Developer)
"""

import sys
import os
from fastapi import APIRouter

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from routing_data.portal_registry import resolve_routing, get_verified_wards
from backend.app.models.schemas import RoutingResolveRequest, RoutingResolveResponse

router = APIRouter(prefix="/api/routing", tags=["Routing"])

@router.post("/resolve", response_model=RoutingResolveResponse)
def resolve_jurisdiction(request: RoutingResolveRequest):
    """
    Returns verified department routing for a given category & locality.
    """
    res = resolve_routing(
        category=request.category,
        city=request.city,
        ward=request.ward,
        landmark=request.landmark
    )
    return RoutingResolveResponse(**res)

@router.get("/wards")
def list_pilot_wards():
    """
    Returns the list of verified demonstration wards for the pilot area.
    """
    return {
        "pilot_city": "Chennai",
        "corporation": "Greater Chennai Corporation (GCC)",
        "wards": get_verified_wards()
    }
