.PHONY: help setup build up down logs test clean deploy k8s-deploy k8s-clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## Initialize project (create secrets)
	./setup.sh

build: ## Build Docker images
	docker-compose build

up: ## Start all services
	docker-compose up -d

down: ## Stop all services
	docker-compose down

logs: ## Show logs
	docker-compose logs -f

test-backend: ## Run backend tests
	cd spring-phone-book && mvn test

test-frontend: ## Run frontend tests
	cd phone-book-frontend && npm test

test: test-backend test-frontend ## Run all tests

clean: ## Clean Docker resources
	docker-compose down -v
	docker system prune -f

deploy: setup build up ## Full deployment (setup + build + up)

k8s-deploy: ## Deploy to Kubernetes
	cd k8s && ./deploy.sh

k8s-clean: ## Clean Kubernetes deployment
	kubectl delete namespace phone-book

k8s-logs: ## Show Kubernetes logs
	kubectl logs -f deployment/backend -n phone-book

status: ## Show service status
	docker-compose ps

health: ## Check service health
	@echo "Backend health:"
	@curl -s http://localhost:8080/actuator/health | jq .
	@echo "\nFrontend health:"
	@curl -s -o /dev/null -w "%{http_code}" http://localhost

restart: down up ## Restart all services
