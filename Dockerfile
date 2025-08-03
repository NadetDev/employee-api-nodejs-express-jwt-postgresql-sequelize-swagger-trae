FROM node:18-alpine

WORKDIR /app

# Installation des dépendances système nécessaires
RUN apk add --no-cache postgresql-client

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm ci --only=production

# Copie du code source
COPY . .

# Ajout du script d'entrée et permissions d'exécution
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Exposition du port
EXPOSE 3000

# Commande de démarrage
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]