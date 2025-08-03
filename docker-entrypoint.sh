#!/bin/sh

set -e

# Attendre que PostgreSQL soit prêt
echo "Attente de PostgreSQL..."
sleep 5

# Exécuter les migrations et les seeders
echo "Exécution des migrations..."
npx sequelize-cli db:migrate

echo "Exécution des seeders..."
npx sequelize-cli db:seed:all

# Démarrer l'application
echo "Démarrage de l'application..."
exec "$@"