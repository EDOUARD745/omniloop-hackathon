# OmniLoop — Logistique Circulaire Intégrée

> Plateforme SaaS de gestion de l'offboarding matériel (IT + textile)

OmniLoop automatise la récupération et la réutilisation du matériel d'entreprise quand un collaborateur quitte l'organisation : les équipements IT sont réaffectés en interne, les uniformes et EPI sont envoyés au recyclage textile avec certificat, et les demandes d'achat sont interceptées si du matériel disponible peut être réaffecté à la place.

## Fonctionnalités

- **Dashboard RSE** — KPIs en temps réel : économies générées, CO₂ évité, équipements réaffectés, tonnes de textile recyclées
- **Gestion des offboardings** — déclenchement depuis Workday (simulé), suivi du statut par employé
- **Inventaire IT** — catalogue des équipements disponibles, réaffectation en un clic
- **Recyclage textile** — suivi des collectes (uniformes, EPI), génération de bons d'expédition, certificats de recyclage
- **Intercepteur d'achats** — bloque une demande d'achat neuf si du matériel disponible peut la couvrir
- **Portail partenaires** — réseau de prestataires (recycleurs, remetteurs en état)
- **Simulateur ROI** — projection des économies selon le volume de départs
- **Scorecard par département** — comparatif des pratiques circulaires entre services

## Stack

| Couche | Techno |
|--------|--------|
| Backend | Python 3.11+, FastAPI, Uvicorn |
| Frontend | React 18, Vite |
| Données | In-memory (démo) |

## Lancer le projet

### Prérequis

- Python 3.11+
- Node.js 18+

### Option 1 — Deux terminaux (recommandé)

**Terminal 1 — Backend :**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

API disponible sur `http://localhost:8000` — docs Swagger sur `http://localhost:8000/docs`

**Terminal 2 — Frontend :**
```bash
cd frontend
npm install
npm run dev
```

App disponible sur `http://localhost:5173`

### Option 2 — Script unique

```bash
chmod +x start.sh
./start.sh
```

## API — Endpoints principaux

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/dashboard` | Métriques RSE agrégées |
| GET | `/api/employees` | Liste des départs annoncés |
| GET | `/api/employees/{id}` | Détail employé + matériel + textile |
| GET | `/api/equipment` | Inventaire équipements IT |
| POST | `/api/equipment/{id}/reassign` | Réaffecter un équipement |
| GET | `/api/textile-orders` | Commandes de recyclage textile |
| POST | `/api/textile-orders/{id}/generate-shipping` | Générer un bon d'expédition |
| GET | `/api/purchase-requests` | Demandes d'achat interceptées |
| POST | `/api/offboarding/trigger` | Déclencher un offboarding |
| GET | `/api/business-metrics` | Métriques business (pitch) |

## Dépannage

| Erreur | Solution |
|--------|----------|
| `command not found: uvicorn` | Utiliser `python -m uvicorn` |
| `No module named uvicorn` | Lancer `pip install -r backend/requirements.txt` |
| Port déjà utilisé | `--port 8001` pour le backend, modifier `vite.config.js` pour le frontend |

## Contexte

Projet hackathon — Groupe 14. Les données sont entièrement simulées (in-memory), aucune base de données réelle n'est connectée.
