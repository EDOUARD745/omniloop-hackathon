"""
OmniLoop - Plateforme de Logistique Circulaire Intégrée
API Backend pour le prototypage Hackathon
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

app = FastAPI(
    title="OmniLoop API",
    description="Logistique Circulaire Intégrée - Gestion offboarding & recyclage",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ MODÈLES ============

class Employee(BaseModel):
    id: str
    name: str
    department: str
    departure_date: str
    status: str  # "pending", "in_progress", "completed"

class Equipment(BaseModel):
    id: str
    type: str
    brand: str
    serial_number: str
    employee_id: Optional[str] = None
    status: str  # "assigned", "available", "recycled"

class TextileOrder(BaseModel):
    id: str
    employee_id: str
    items: list[dict]
    total_kg: float
    status: str  # "pending", "shipped", "recycled"
    certificate_url: Optional[str] = None

class PurchaseRequest(BaseModel):
    id: str
    manager: str
    item_type: str
    quantity: int
    status: str  # "blocked", "approved", "reassigned"

class OffboardingTrigger(BaseModel):
    name: str
    department: str
    role: str
    exitDate: str
    assets: dict  # laptop, screen, headset, badge, uniformKg

# ============ DONNÉES DE DÉMO ============

EMPLOYEES = [
    {"id": "EMP001", "name": "Marie Dupont", "department": "IT Support", "departure_date": "2025-03-15", "status": "in_progress"},
    {"id": "EMP002", "name": "Thomas Martin", "department": "Technique Orange", "departure_date": "2025-03-20", "status": "pending"},
    {"id": "EMP003", "name": "Sophie Bernard", "department": "Commercial SNCF", "departure_date": "2025-03-25", "status": "pending"},
]

EQUIPMENT = [
    {"id": "EQ001", "type": "Écran", "brand": "Dell", "serial_number": "DL-2024-001", "employee_id": "EMP001", "status": "assigned"},
    {"id": "EQ002", "type": "Casque", "brand": "Jabra", "serial_number": "JB-2024-002", "employee_id": "EMP001", "status": "assigned"},
    {"id": "EQ003", "type": "Clavier", "brand": "Logitech", "serial_number": "LG-2024-003", "employee_id": "EMP001", "status": "assigned"},
    {"id": "EQ004", "type": "Casque", "brand": "Sennheiser", "serial_number": "SN-2023-015", "employee_id": None, "status": "available"},
    {"id": "EQ005", "type": "Écran", "brand": "HP", "serial_number": "HP-2023-042", "employee_id": "EMP002", "status": "assigned"},
]

TEXTILE_ORDERS = [
    {"id": "TXT001", "employee_id": "EMP001", "items": [{"type": "Uniforme", "kg": 2.5}, {"type": "EPI", "kg": 1.2}], "total_kg": 3.7, "status": "shipped", "certificate_url": None},
    {"id": "TXT002", "employee_id": "EMP002", "items": [{"type": "Uniforme Orange", "kg": 3.0}], "total_kg": 3.0, "status": "pending", "certificate_url": None},
]

PURCHASE_REQUESTS = [
    {"id": "PR001", "manager": "Jean Lefebvre", "item_type": "Casque", "quantity": 1, "status": "reassigned", "savings": 89},
    {"id": "PR002", "manager": "Anne Petit", "item_type": "Écran", "quantity": 1, "status": "blocked", "savings": 250},
]

# ============ ENDPOINTS ============

@app.get("/")
def root():
    return {"message": "OmniLoop API - Logistique Circulaire Intégrée", "version": "0.1.0"}

@app.get("/api/dashboard")
def get_dashboard():
    """Métriques pour le tableau de bord RSE"""
    return {
        "economies_mensuelles": 12450,
        "equipements_reaffectes": 47,
        "tonnes_textile_recyclees": 2.3,
        "achats_evites": 23,
        "roi_percent": 340,
        "co2_evite_kg": 1850,
    }

@app.get("/api/employees")
def get_employees():
    """Liste des départs annoncés (simulation Workday)"""
    return {"employees": EMPLOYEES}

@app.get("/api/employees/{employee_id}")
def get_employee(employee_id: str):
    emp = next((e for e in EMPLOYEES if e["id"] == employee_id), None)
    if not emp:
        raise HTTPException(404, "Employé non trouvé")
    equipment = [e for e in EQUIPMENT if e.get("employee_id") == employee_id]
    textile = next((t for t in TEXTILE_ORDERS if t["employee_id"] == employee_id), None)
    return {"employee": emp, "equipment": equipment, "textile_order": textile}

@app.get("/api/equipment")
def get_equipment(available_only: bool = False):
    """Inventaire équipements IT"""
    items = EQUIPMENT
    if available_only:
        items = [e for e in EQUIPMENT if e["status"] == "available"]
    return {"equipment": items}

@app.post("/api/equipment/{equipment_id}/reassign")
def reassign_equipment(equipment_id: str, new_employee_id: str):
    """Réaffecter un équipement à un nouveau collaborateur"""
    eq = next((e for e in EQUIPMENT if e["id"] == equipment_id), None)
    if not eq:
        raise HTTPException(404, "Équipement non trouvé")
    eq["employee_id"] = new_employee_id
    eq["status"] = "assigned"
    return {"message": "Équipement réaffecté", "equipment": eq}

@app.get("/api/textile-orders")
def get_textile_orders():
    """Commandes de recyclage textile"""
    return {"orders": TEXTILE_ORDERS}

@app.post("/api/textile-orders/{order_id}/generate-shipping")
def generate_shipping_label(order_id: str):
    """Générer le bon d'expédition pour le textile"""
    order = next((o for o in TEXTILE_ORDERS if o["id"] == order_id), None)
    if not order:
        raise HTTPException(404, "Commande non trouvée")
    order["status"] = "shipped"
    return {
        "message": "Bon d'expédition généré",
        "tracking_number": "OMNI-2025-" + order_id[-3:],
        "partner_center": "EcoTextile Paris Nord",
    }

@app.get("/api/purchase-requests")
def get_purchase_requests():
    """Demandes d'achat bloquées/réaffectées"""
    return {"requests": PURCHASE_REQUESTS}

@app.post("/api/offboarding/trigger")
def trigger_offboarding(data: OffboardingTrigger):
    """Simule le déclenchement d'un offboarding (formulaire dashboard)"""
    return {
        "message": "Offboarding déclenché",
        "employee": {
            "name": data.name,
            "department": data.department,
            "role": data.role,
            "exit_date": data.exitDate,
            "assets": data.assets,
        },
    }

@app.get("/api/business-metrics")
def get_business_metrics():
    """Métriques business pour le pitch"""
    return {
        "abonnement_saas_mois": 499,
        "success_fee_mois": 1245,
        "recyclage_textile_mois": 890,
        "total_revenus_mois": 2634,
        "economies_client_mois": 12450,
    }
