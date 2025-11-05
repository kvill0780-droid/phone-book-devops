# 🚀 Guide Push vers GitHub

## 1️⃣ Créer le repository sur GitHub

1. Aller sur https://github.com/new
2. Nom du repository: `phone-book-devops`
3. Description: `Application de gestion de contacts avec architecture microservices et pipeline CI/CD`
4. Visibilité: **Public** (pour GitHub Actions gratuit)
5. **NE PAS** initialiser avec README, .gitignore ou licence
6. Cliquer sur "Create repository"

## 2️⃣ Pousser le code

```bash
cd "/home/kvill/IdeaProjects/projet devOps"

# Ajouter le remote
git remote add origin https://github.com/kvill/phone-book-devops.git

# Pousser le code
git push -u origin main
```

## 3️⃣ Configurer les Secrets GitHub

Aller dans: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

### Secrets requis:

```bash
# 1. DOCKER_USERNAME
kvill

# 2. DOCKER_PASSWORD
# Aller sur https://hub.docker.com/settings/security
# Créer un "New Access Token"
# Copier le token

# 3. KUBE_CONFIG (optionnel pour auto-deploy)
cat ~/.kube/config | base64 -w 0
# Copier le résultat
```

## 4️⃣ Créer les repositories Docker Hub

1. Aller sur https://hub.docker.com
2. Créer 2 repositories:
   - `kvill/phone-book-backend`
   - `kvill/phone-book-frontend`
3. Visibilité: Public

## 5️⃣ Vérifier le pipeline

1. Aller sur https://github.com/kvill/phone-book-devops/actions
2. Le workflow devrait se lancer automatiquement
3. Vérifier que toutes les étapes passent

## 6️⃣ Mettre à jour les URLs dans les fichiers

### README.md
```markdown
![CI/CD Pipeline](https://github.com/kvill/phone-book-devops/actions/workflows/ci-cd.yml/badge.svg)
```

### Workflows (.github/workflows/*.yml)
Remplacer `kvill` par votre username si différent

## ✅ Checklist finale

- [ ] Repository GitHub créé
- [ ] Code poussé sur GitHub
- [ ] Secrets GitHub configurés
- [ ] Repositories Docker Hub créés
- [ ] Pipeline CI/CD testé
- [ ] Badges ajoutés au README
- [ ] Documentation à jour

## 🎯 Commandes utiles

```bash
# Voir les remotes
git remote -v

# Voir l'historique
git log --oneline

# Créer une nouvelle branche
git checkout -b develop

# Pousser une branche
git push origin develop

# Voir le statut
git status
```
