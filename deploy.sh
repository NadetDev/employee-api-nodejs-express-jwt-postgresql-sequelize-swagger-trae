#!/bin/bash

# Script de déploiement pour l'API de Gestion des Employés

set -e

echo "Déploiement de l'API de Gestion des Employés"

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "Docker n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
fi

# Arrêter les conteneurs existants
echo "Arrêt des conteneurs existants..."
docker-compose down || true

# Récupérer les dernières modifications
echo "Récupération des dernières modifications..."
git pull

# Construire et démarrer les conteneurs
echo "Construction et démarrage des conteneurs..."
docker-compose build --no-cache
docker-compose up -d

# Vérifier que les conteneurs sont en cours d'exécution
echo "Vérification des conteneurs..."
docker-compose ps

echo "Déploiement terminé avec succès!"
echo "L'API est accessible à l'adresse http://localhost:3000"
echo "La documentation Swagger est accessible à l'adresse http://localhost:3000/api-docs"