#!/bin/bash
# Script de lancement OmniLoop - Hackathon

cd "$(dirname "$0")"

echo "🚀 Lancement d'OmniLoop..."
echo ""

# Vérifier les dépendances backend
if ! python -c "import fastapi" 2>/dev/null; then
  echo "📦 Installation des dépendances Python..."
  pip install -r backend/requirements.txt
fi

# Vérifier les dépendances frontend
if [ ! -d "frontend/node_modules" ]; then
  echo "📦 Installation des dépendances Node..."
  cd frontend && npm install && cd ..
fi

echo ""
echo "✅ Démarrage du backend (port 8000)..."
(cd backend && python -m uvicorn main:app --reload --port 8000) &
BACKEND_PID=$!

echo "✅ Démarrage du frontend (port 5173)..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "=========================================="
echo "  OmniLoop est prêt !"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8000"
echo "=========================================="
echo ""
echo "Appuyez sur Ctrl+C pour arrêter les serveurs."

wait
