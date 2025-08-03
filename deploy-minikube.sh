#!/bin/bash

set -e

# Vérifier si Minikube est en cours d'exécution
if ! minikube status &>/dev/null; then
  echo "Démarrage de Minikube..."
  minikube start
  minikube addons enable ingress
fi

# Créer le namespace s'il n'existe pas
kubectl create namespace employee-api --dry-run=client -o yaml | kubectl apply -f -

# Créer les secrets
kubectl create secret generic employee-api-secrets \
  --namespace=employee-api \
  --from-literal=DB_PASSWORD=P@ssword0123 \
  --from-literal=JWT_SECRET=votre_secret_jwt \
  --dry-run=client -o yaml | kubectl apply -f -

# Appliquer les configurations Kubernetes
kubectl apply -f k8s/

# Attendre que les pods soient prêts
echo "Attente du déploiement de la base de données..."
kubectl rollout status deployment/postgres -n employee-api --timeout=180s

echo "Attente du déploiement de l'API..."
kubectl rollout status deployment/employee-api -n employee-api --timeout=180s

# Afficher l'URL du service
echo "\nURL de l'application:"
minikube service employee-api -n employee-api --url

# Ajouter l'entrée dans /etc/hosts pour l'ingress
echo "\nPour utiliser l'ingress, ajoutez cette ligne à votre fichier /etc/hosts:"
echo "$(minikube ip) employee-api.local"

echo "\nDéploiement terminé avec succès!"