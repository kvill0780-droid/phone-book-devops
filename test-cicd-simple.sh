#!/bin/bash

echo "=========================================="
echo "   Test CI/CD - Build Uniquement"
echo "=========================================="
echo ""

echo "\ud83d\udce6 Build Backend..."
cd spring-phone-book
docker build -t projetdevops-backend:cicd-test . > /tmp/backend-build.log 2>&1
if [ $? -eq 0 ]; then
  echo "\u2705 Backend build OK"
else
  echo "\u274c Backend build FAILED"
  tail -20 /tmp/backend-build.log
  exit 1
fi
cd ..

echo ""
echo "\ud83d\udce6 Build Frontend..."
cd phone-book-frontend
docker build -t projetdevops-frontend:cicd-test . > /tmp/frontend-build.log 2>&1
if [ $? -eq 0 ]; then
  echo "\u2705 Frontend build OK"
else
  echo "\u274c Frontend build FAILED"
  tail -20 /tmp/frontend-build.log
  exit 1
fi
cd ..

echo ""
echo "\ud83d\udc33 Images cr\u00e9\u00e9es:"
docker images | grep cicd-test

echo ""
echo "\ud83e\uddf9 Nettoyage..."
docker rmi projetdevops-backend:cicd-test projetdevops-frontend:cicd-test 2>/dev/null

echo ""
echo "=========================================="
echo "\u2705 Test CI/CD r\u00e9ussi!"
echo "=========================================="
echo ""
echo "Les images Docker se construisent correctement."
echo "Le pipeline GitHub Actions devrait fonctionner."
