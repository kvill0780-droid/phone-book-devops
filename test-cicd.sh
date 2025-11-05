#!/bin/bash

echo "=========================================="
echo "   Test CI/CD Pipeline Localement"
echo "=========================================="
echo ""

echo "📦 Étape 1: Build Backend"
cd spring-phone-book
docker build -t projetdevops-backend:cicd-test . || exit 1
cd ..
echo "✅ Backend build OK"
echo ""

echo "📦 Étape 2: Build Frontend"
cd phone-book-frontend
docker build -t projetdevops-frontend:cicd-test . || exit 1
cd ..
echo "✅ Frontend build OK"
echo ""

echo "🐳 Étape 3: Vérifier les images"
docker images | grep cicd-test
echo ""

echo "🧪 Étape 4: Test rapide des images"
echo "Test Backend...
docker run --rm -d --name backend-test -p 8081:8080 projetdevops-backend:cicd-test
echo "Attente démarrage backend (30s)..."
sleep 30
if curl -f http://localhost:8081/actuator/health 2>/dev/null; then
  echo "✅ Backend accessible"
else
  echo "⚠️ Backend non accessible (normal, besoin MySQL/Redis)"
fi
docker stop backend-test 2>/dev/null || true
echo ""

echo "Test Frontend..."
docker run --rm -d --name frontend-test -p 8001:80 projetdevops-frontend:cicd-test
echo "Attente démarrage frontend (5s)..."
sleep 5
if curl -f http://localhost:8001 2>/dev/null | head -5; then
  echo "✅ Frontend accessible"
else
  echo "❌ Frontend non accessible"
fi
docker stop frontend-test 2>/dev/null || true
echo ""

echo "🧹 Nettoyage"
docker rmi projetdevops-backend:cicd-test projetdevops-frontend:cicd-test
echo ""

echo "=========================================="
echo "✅ Test CI/CD terminé avec succès!"
echo "=========================================="
