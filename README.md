# OmniLoop - Logistique Circulaire Intégrée

> Plateforme SaaS de gestion de l'offboarding matériel en entreprise (IT + textile)

OmniLoop transforme le départ d'un collaborateur en opportunité circulaire : les équipements IT sont réaffectés en interne plutôt que rachetés neufs, les uniformes et EPI sont envoyés au recyclage textile avec certificat traçable, et les demandes d'achat sont automatiquement interceptées si du matériel disponible peut les couvrir.

---

## Contexte

Projet réalisé dans le cadre d'un hackathon par le **Groupe 14**, coaché par **Claire Carmen**.

**Équipe :** Edouard Louamou (La Poste), Lisa Dufailly (Sanofi), Julien Aubrun (ITGA), Anaïs Lateb (BNP Paribas), Uzair Tinnin (BNP Paribas), Pierre Romagny (Total Energies), Clément Bilot (Orano), Assia Belmokhtar (Orange), Mathilde Lebé (Orange), Amine Agnaou (Orange), Lucas Bihl (EDF)

---

## Fonctionnalités

### Dashboard RSE
Vue centralisée des indicateurs clés : économies générées, CO₂ évité, équipements réaffectés, tonnes de textile recyclées, ROI global.

### Gestion des offboardings
Déclenchement manuel ou automatisé (simulation Workday) d'un processus d'offboarding — suivi du statut en temps réel par employé, avec récapitulatif des actifs associés (matériel IT, badge, uniforme).

### Journal d'activité
Historique chronologique de toutes les actions de la plateforme : réaffectations, expéditions textile, achats bloqués.

### Scorecard par département
Comparatif des pratiques circulaires entre services — taux de réemploi, volumes recyclés, économies générées.

### Catalogue interne de réemploi
Inventaire du matériel disponible (statut, marque, numéro de série) avec réaffectation directe depuis l'interface.

### Partenaires recyclage textile
Suivi des collectes (uniformes, EPI) par partenaire certifié, génération de bons d'expédition, téléchargement des certificats de recyclage.

### Réseau de partenaires
Carte interactive des prestataires (recycleurs, remetteurs en état, reconditionneurs) avec profil détaillé et contact.

### Simulateur ROI
Projection des économies réalisables selon le volume de départs, le panier moyen matériel et les coûts de recyclage textile.

### Intercepteur d'achats
Modal déclenché lors d'une nouvelle demande d'achat — vérifie en temps réel si du matériel interne disponible peut satisfaire le besoin avant de valider la commande neuve.

---

## Stack

| Couche | Techno |
|--------|--------|
| Backend | Python 3.11+, FastAPI, Uvicorn, Pydantic |
| Frontend | React 18, Vite, Framer Motion |
| Données | In-memory (données de démo) |

---

## Lancer le projet

### Prérequis

- Python 3.11+
- Node.js 18+

### Option 1 — Deux terminaux (recommandé)

**Terminal 1 — Backend :**
```bash
cd omniloop-hackathon/backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

API disponible sur `http://localhost:8000`  
Documentation Swagger interactive : `http://localhost:8000/docs`

**Terminal 2 — Frontend :**
```bash
cd omniloop-hackathon/frontend
npm install
npm run dev
```

Application disponible sur `http://localhost:5173`

### Option 2 — Script unique

```bash
cd omniloop-hackathon
chmod +x start.sh
./start.sh
```

---

## API — Endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/dashboard` | Métriques RSE agrégées |
| GET | `/api/employees` | Liste des départs annoncés |
| GET | `/api/employees/{id}` | Détail employé + matériel + textile |
| GET | `/api/equipment` | Inventaire équipements IT |
| GET | `/api/equipment?available_only=true` | Équipements disponibles uniquement |
| POST | `/api/equipment/{id}/reassign` | Réaffecter un équipement |
| GET | `/api/textile-orders` | Commandes de recyclage textile |
| POST | `/api/textile-orders/{id}/generate-shipping` | Générer un bon d'expédition |
| GET | `/api/purchase-requests` | Demandes d'achat interceptées |
| POST | `/api/offboarding/trigger` | Déclencher un offboarding |
| GET | `/api/business-metrics` | Métriques business |

---

## Structure du projet

```
omniloop-hackathon/
├── backend/
│   ├── main.py              # API FastAPI
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── components/      # Tous les écrans (Dashboard, Textile, ROI…)
│       ├── context/         # Auth, Purchase interceptor, Tab state
│       ├── data/            # Données de démo statiques
│       └── App.jsx          # Routing et layout principal
└── start.sh                 # Script de démarrage tout-en-un
```

---

## Dépannage

| Erreur | Solution |
|--------|----------|
| `command not found: uvicorn` | Utiliser `python -m uvicorn` |
| `No module named uvicorn` | Lancer `pip install -r omniloop-hackathon/backend/requirements.txt` |
| Port déjà utilisé | `--port 8001` pour le backend, modifier `vite.config.js` pour le frontend |
