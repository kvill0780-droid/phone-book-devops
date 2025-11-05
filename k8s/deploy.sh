#!/bin/bash
set -e

echo "🚀 Deploying Phone Book Application to Kubernetes"
echo "=================================================="

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl not found. Please install kubectl first."
    exit 1
fi

# Apply manifests in order
echo "📦 Creating namespace..."
kubectl apply -f base/namespace.yaml

echo "🔐 Creating secrets..."
kubectl apply -f base/secrets.yaml

echo "⚙️  Creating ConfigMap..."
kubectl apply -f base/configmap.yaml

echo "💾 Deploying MySQL..."
kubectl apply -f base/mysql-deployment.yaml

echo "🔴 Deploying Redis..."
kubectl apply -f base/redis-deployment.yaml

echo "⏳ Waiting for database to be ready..."
kubectl wait --for=condition=ready pod -l app=mysql -n phone-book --timeout=120s

echo "🔧 Deploying Backend..."
kubectl apply -f base/backend-deployment.yaml

echo "🎨 Deploying Frontend..."
kubectl apply -f base/frontend-deployment.yaml

echo "📊 Deploying Prometheus..."
kubectl apply -f base/prometheus-deployment.yaml

echo "📈 Deploying Grafana..."
kubectl apply -f base/grafana-deployment.yaml

echo "🌐 Creating Ingress..."
kubectl apply -f base/ingress.yaml

echo "📏 Creating HPA..."
kubectl apply -f base/hpa.yaml

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Checking deployment status..."
kubectl get pods -n phone-book
echo ""
echo "🔗 Services:"
kubectl get svc -n phone-book
echo ""
echo "📝 To access the application:"
echo "1. Add to /etc/hosts: 127.0.0.1 phone-book.local"
echo "2. Enable Ingress (minikube): minikube addons enable ingress"
echo "3. Access: http://phone-book.local"
echo ""
echo "🔍 Useful commands:"
echo "  kubectl get pods -n phone-book"
echo "  kubectl logs -f deployment/backend -n phone-book"
echo "  kubectl describe pod <pod-name> -n phone-book"
