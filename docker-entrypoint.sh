#!/bin/sh

set -e

# Attendre que PostgreSQL soit prêt
echo "Attente de PostgreSQL..."

# Boucle pour vérifier si PostgreSQL est prêt
until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; do
  echo "PostgreSQL n'est pas encore prêt - attente..."
  sleep 2
done

echo "PostgreSQL est prêt !"

# Exécuter les migrations et les seeders
echo "Exécution des migrations..."
npx sequelize-cli db:migrate

echo "Exécution des seeders..."
npx sequelize-cli db:seed:all

# Démarrer l'application
echo "Démarrage de l'application..."
exec "$@"