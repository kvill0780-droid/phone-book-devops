# 🚀 Configuration CI/CD - Guide Complet

## 📋 Prérequis

1. Compte Docker Hub : https://hub.docker.com
2. Repository GitHub avec le code
3. Cluster Kubernetes accessible

## 🔐 Étape 1 : Secrets GitHub

Aller dans : `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

### Secrets requis :

```bash
DOCKER_USERNAME=votre_username_dockerhub
DOCKER_PASSWORD=votre_token_dockerhub
KUBE_CONFIG=base64_de_votre_kubeconfig
```

### Générer KUBE_CONFIG :

```bash
# Pour Minikube
cat ~/.kube/config | base64 -w 0

# Copier le résultat dans le secret GitHub
```

## 🐳 Étape 2 : Docker Hub

1. Créer les repositories :
   - `kvill/phone-book-backend`
   - `kvill/phone-book-frontend`

2. Générer un Access Token :
   - Account Settings → Security → New Access Token
   - Permissions : Read, Write, Delete
   - Copier le token dans `DOCKER_PASSWORD`

## ✅ Étape 3 : Tester localement

### Test Backend :
```bash
cd spring-phone-book
mvn clean test
```

### Test Frontend :
```bash
cd phone-book-frontend
npm ci
npm run lint
```

### Build Docker :
```bash
docker build -t kvill/phone-book-backend:test spring-phone-book/
docker build -t kvill/phone-book-frontend:test phone-book-frontend/
```

## 🚀 Étape 4 : Déclencher le pipeline

```bash
git add .
git commit -m "feat: trigger CI/CD pipeline"
git push origin main
```

## 📊 Étape 5 : Vérifier

1. GitHub → Actions → Voir le workflow en cours
2. Vérifier chaque job (test, build, deploy)
3. En cas d'erreur, consulter les logs

## 🔄 Workflow complet

```
Push → Test → Build → Security Scan → Deploy → Verify
 ↓      ↓      ↓           ↓            ↓        ↓
2min   3min   5min        2min         3min     1min
```

**Durée totale : ~15 minutes**
