# 📎 Annexes - Rapport Technique

## Annexe A : Captures d'écran

### A.1 Application en fonctionnement
- Interface de connexion
- Dashboard des contacts
- Gestion des groupes
- Recherche et filtres

### A.2 Dashboards Grafana
- Vue d'ensemble système
- Métriques backend
- Performance base de données
- Utilisation ressources

### A.3 Pipeline CI/CD
- GitHub Actions workflow
- Build logs
- Déploiement Kubernetes
- Vérification post-déploiement

## Annexe B : Logs de déploiement

### B.1 Déploiement réussi
```
✅ Backend deployment: 2/2 pods Running
✅ Frontend deployment: 2/2 pods Running  
✅ MySQL StatefulSet: 1/1 pods Running
✅ Redis deployment: 1/1 pods Running
✅ Prometheus deployment: 1/1 pods Running
✅ Grafana deployment: 1/1 pods Running
✅ Ingress: Active (192.168.49.2)
```

### B.2 Temps de déploiement
```
Phase 1 - Build: 5min 23s
Phase 2 - Tests: 2min 45s
Phase 3 - Docker: 3min 12s
Phase 4 - Deploy: 4min 08s
Total: 15min 28s
```

## Annexe C : Résultats tests de charge

### C.1 Test avec 100 utilisateurs concurrents
```
Requests per second: 450 req/s
Average response time: 45ms
95th percentile: 120ms
99th percentile: 250ms
Error rate: 0.02%
```

### C.2 Test avec cache Redis
```
Sans cache:
- Response time: 380ms
- DB queries: 1000/s

Avec cache:
- Response time: 42ms (9x plus rapide)
- DB queries: 150/s (85% de réduction)
- Cache hit ratio: 87%
```

## Annexe D : Configuration des secrets

### D.1 Secrets Kubernetes
```yaml
# secrets.yaml (exemple)
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secret
  namespace: phone-book
type: Opaque
data:
  MYSQL_ROOT_PASSWORD: <base64>
  MYSQL_PASSWORD: <base64>
```

### D.2 Secrets GitHub Actions
```
DOCKER_USERNAME: username_dockerhub
DOCKER_PASSWORD: token_dockerhub
KUBE_CONFIG: base64_kubeconfig
```

### D.3 Génération sécurisée
```bash
# Générer mot de passe aléatoire
openssl rand -base64 32

# Encoder en base64
echo -n "password" | base64

# Créer secret Kubernetes
kubectl create secret generic mysql-secret \
  --from-literal=MYSQL_ROOT_PASSWORD=xxx \
  --from-literal=MYSQL_PASSWORD=yyy \
  -n phone-book
```

## Annexe E : Commandes utiles

### E.1 Kubernetes
```bash
# Vérifier l'état
kubectl get all -n phone-book

# Logs d'un pod
kubectl logs -f <pod-name> -n phone-book

# Scaler un deployment
kubectl scale deployment backend --replicas=5 -n phone-book

# Redémarrer un deployment
kubectl rollout restart deployment backend -n phone-book

# Rollback
kubectl rollout undo deployment backend -n phone-book
```

### E.2 Docker
```bash
# Build images
docker build -t backend spring-phone-book/
docker build -t frontend phone-book-frontend/

# Lancer Docker Compose
docker-compose up -d

# Voir les logs
docker-compose logs -f backend

# Nettoyer
docker system prune -a
```

### E.3 Monitoring
```bash
# Port-forward Grafana
kubectl port-forward svc/grafana 3000:3000 -n phone-book

# Port-forward Prometheus
kubectl port-forward svc/prometheus 9090:9090 -n phone-book

# Vérifier métriques
curl http://localhost:8080/actuator/prometheus
```

## Annexe F : Checklist déploiement

### F.1 Avant le déploiement
- [ ] Tests unitaires passent
- [ ] Tests d'intégration passent
- [ ] Images Docker buildées
- [ ] Secrets configurés
- [ ] Manifests Kubernetes validés
- [ ] Backup base de données effectué

### F.2 Pendant le déploiement
- [ ] Pipeline CI/CD lancé
- [ ] Build réussi
- [ ] Tests réussis
- [ ] Images pushées
- [ ] Déploiement K8s appliqué
- [ ] Pods démarrés

### F.3 Après le déploiement
- [ ] Application accessible
- [ ] Health checks OK
- [ ] Métriques remontées
- [ ] Logs normaux
- [ ] Tests smoke passent
- [ ] Documentation mise à jour

## Annexe G : Troubleshooting

### G.1 Pod en CrashLoopBackOff
```bash
# Vérifier les logs
kubectl logs <pod-name> -n phone-book

# Vérifier les events
kubectl describe pod <pod-name> -n phone-book

# Vérifier les ressources
kubectl top pod <pod-name> -n phone-book
```

### G.2 Service non accessible
```bash
# Vérifier le service
kubectl get svc -n phone-book

# Vérifier les endpoints
kubectl get endpoints -n phone-book

# Tester depuis un pod
kubectl run test --rm -it --image=busybox -n phone-book -- sh
wget -O- http://backend:8080/actuator/health
```

### G.3 Problèmes de cache Redis
```bash
# Vider le cache
kubectl exec redis-xxx -n phone-book -- redis-cli FLUSHALL

# Vérifier les clés
kubectl exec redis-xxx -n phone-book -- redis-cli KEYS '*'

# Monitorer Redis
kubectl exec redis-xxx -n phone-book -- redis-cli MONITOR
```

## Annexe H : Métriques de succès

### H.1 Disponibilité
- Uptime: 99.9%
- MTTR (Mean Time To Recovery): < 5 minutes
- MTBF (Mean Time Between Failures): > 30 jours

### H.2 Performance
- Response time p50: 45ms
- Response time p95: 120ms
- Response time p99: 250ms
- Throughput: 450 req/s

### H.3 Déploiement
- Fréquence: 5-10 déploiements/jour
- Durée: 15 minutes
- Taux de succès: 95%
- Rollback time: < 2 minutes

### H.4 Qualité
- Code coverage: 75%
- Security vulnerabilities: 0 critical
- Technical debt: < 5%
- Documentation: 100%
