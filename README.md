# API de Gestion des Employés

Une API RESTful pour la gestion des employés, construite avec Express.js, PostgreSQL et JWT pour l'authentification.

## Fonctionnalités

- Authentification des utilisateurs avec JWT
- Gestion des rôles (admin, staff)
- Gestion des employés (CRUD)
- Déconnexion avec invalidation des tokens
- Expiration des tokens après 24h
- Documentation interactive avec Swagger

## Prérequis

### Pour l'installation locale
- Node.js (v14 ou supérieur)
- PostgreSQL (v12 ou supérieur)

### Pour l'installation avec Docker
- Docker
- Docker Compose

### Pour le déploiement sur Kubernetes
- Minikube
- kubectl

## Installation

### Option 1 : Installation locale

1. Cloner le dépôt

```bash
git clone <url-du-depot>
cd <nom-du-dossier>
```

2. Installer les dépendances

```bash
npm install
```

3. Configurer les variables d'environnement

Copiez le fichier `.env.example` en `.env` et modifiez les valeurs selon votre environnement :

```bash
cp .env.example .env
```

Modifiez le fichier `.env` avec vos propres valeurs, notamment :
- Les informations de connexion à la base de données
- Un secret JWT sécurisé

Exemple de contenu du fichier `.env` :

```
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=employee_management
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

JWT_SECRET=votre_secret_jwt_super_securise
JWT_EXPIRES_IN=24h
```

4. Créer la base de données et exécuter les migrations

```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

5. Démarrer le serveur

```bash
npm run dev
```

Le serveur sera accessible à l'adresse http://localhost:3000

### Option 2 : Installation avec Docker

1. Cloner le dépôt

```bash
git clone <url-du-depot>
cd <nom-du-dossier>
```

2. Démarrer les conteneurs avec Docker Compose

```bash
docker-compose up -d
```

Cette commande va :
- Construire l'image Docker de l'application
- Démarrer un conteneur PostgreSQL
- Exécuter automatiquement les migrations et les seeders
- Démarrer l'application sur le port 3000

Le serveur sera accessible à l'adresse http://localhost:3000

3. Arrêter les conteneurs

```bash
docker-compose down
```

Pour supprimer également les volumes (données de la base de données) :

```bash
docker-compose down -v
```

## Configuration Docker

L'application est conteneurisée avec Docker pour faciliter le déploiement et le développement. Voici les fichiers Docker inclus :

### Dockerfile

Le `Dockerfile` définit l'image de l'application :
- Basée sur Node.js 18 Alpine pour une image légère
- Installation des dépendances PostgreSQL client pour les migrations
- Script d'entrée pour attendre que la base de données soit prête
- Configuration pour exécuter automatiquement les migrations et seeders

### docker-compose.yml

Le fichier `docker-compose.yml` orchestre les services :

- **Service app** :
  - Construction à partir du Dockerfile local
  - Exposition du port 3000
  - Variables d'environnement préconfigurées
  - Vérifications de santé pour assurer la disponibilité
  - Dépendance sur le service de base de données

- **Service db** :
  - Image PostgreSQL 14 Alpine
  - Exposition du port 5432
  - Volume persistant pour les données
  - Vérifications de santé pour assurer la disponibilité

### docker-entrypoint.sh

Script d'initialisation qui :
- Attend que PostgreSQL soit prêt
- Exécute les migrations de base de données
- Exécute les seeders pour créer l'utilisateur admin par défaut
- Démarre l'application

### .dockerignore

Exclut les fichiers inutiles lors de la construction de l'image Docker pour optimiser la taille et la sécurité.

## Déploiement

### Déploiement manuel avec Docker

Un script de déploiement `deploy.sh` est fourni pour faciliter le déploiement de l'application en production :

```bash
chmod +x deploy.sh
./deploy.sh
```

Ce script effectue les opérations suivantes :
1. Vérifie que Docker et Docker Compose sont installés
2. Arrête les conteneurs existants
3. Récupère les dernières modifications du dépôt Git
4. Reconstruit les images Docker sans utiliser le cache
5. Démarre les conteneurs en mode détaché
6. Vérifie que les conteneurs sont en cours d'exécution

Ce script est particulièrement utile pour les déploiements automatisés ou les mises à jour rapides de l'application.

### CI/CD avec GitHub Actions

Ce projet utilise GitHub Actions pour l'intégration continue et le déploiement continu.

#### Workflows disponibles

1. **Build and Test** (`.github/workflows/build-test.yml`)
   - Déclenché sur les push et pull requests vers main, master et develop
   - Exécute les tests et le linting

2. **Create Release** (`.github/workflows/release.yml`)
   - Déclenché après le succès du workflow "Build and Test" sur main ou master
   - Crée une release GitHub basée sur la version dans package.json

3. **Build and Push Docker Image** (`.github/workflows/docker-build.yml`)
   - Déclenché lors de la création d'une release
   - Construit et publie l'image Docker sur GitHub Container Registry

4. **Deploy to Minikube** (`.github/workflows/deploy-minikube.yml`)
   - Déclenché après le succès du workflow "Build and Push Docker Image"
   - Déploie l'application sur Minikube

### Déploiement sur Kubernetes (Minikube)

#### Déploiement manuel

```bash
# Sur Linux/macOS
./deploy-minikube.sh

# Sur Windows
.\deploy-minikube.ps1
```

Ces scripts vont :
1. Démarrer Minikube si nécessaire
2. Créer le namespace `employee-api`
3. Créer les secrets nécessaires
4. Déployer l'application et la base de données
5. Afficher l'URL d'accès

#### Structure des fichiers Kubernetes

- `k8s/deployment.yaml` : Déploiement de l'API
- `k8s/service.yaml` : Service pour exposer l'API
- `k8s/postgres.yaml` : Déploiement de PostgreSQL avec PVC
- `k8s/ingress.yaml` : Ingress pour accéder à l'API via un nom d'hôte

## Qualité du code

### Linting avec ESLint

Le projet utilise ESLint pour maintenir un style de code cohérent et détecter les erreurs potentielles.

Pour exécuter ESLint :

```bash
npm run lint
```

Pour corriger automatiquement les problèmes détectés :

```bash
npm run lint:fix
```

La configuration d'ESLint est définie dans le fichier `.eslintrc.js` à la racine du projet.

## Tests

L'application inclut des tests unitaires et d'intégration pour garantir la qualité du code et le bon fonctionnement des fonctionnalités.

### Exécution des tests

Pour exécuter tous les tests :

```bash
npm test
```

Pour exécuter les tests en mode watch (utile pendant le développement) :

```bash
npm run test:watch
```

Pour générer un rapport de couverture de code :

```bash
npm run test:coverage
```

### Structure des tests

Les tests sont organisés dans le répertoire `__tests__` avec la structure suivante :

- `__tests__/models/` : Tests unitaires pour les modèles Sequelize
- `__tests__/routes/` : Tests d'intégration pour les routes API

### Configuration de Jest

La configuration des tests est définie dans le fichier `jest.config.js` à la racine du projet.

## Documentation de l'API avec Swagger

L'API est documentée avec Swagger, ce qui permet d'explorer et de tester facilement les endpoints disponibles.

### Accès à la documentation

Une fois le serveur démarré, vous pouvez accéder à l'interface Swagger à l'adresse suivante :

```
http://localhost:3000/api-docs
```

### Fonctionnalités de Swagger UI

- **Documentation interactive** : Explorez tous les endpoints de l'API avec leurs paramètres, corps de requête et réponses.
- **Test des endpoints** : Testez directement les endpoints depuis l'interface Swagger.
- **Authentification** : Utilisez le bouton "Authorize" pour vous authentifier avec un token JWT.

### Authentification

Pour tester les endpoints protégés :

1. Connectez-vous via l'endpoint `/api/auth/login` pour obtenir un token JWT.
2. Cliquez sur le bouton "Authorize" en haut de la page Swagger UI.
3. Entrez votre token au format `Bearer votre_token_jwt`.
4. Cliquez sur "Authorize" puis fermez la fenêtre.

Vous pouvez maintenant tester tous les endpoints protégés.

## Utilisation de l'API

### Authentification

#### Inscription

```
POST /api/auth/register
```

Corps de la requête :

```json
{
  "username": "utilisateur",
  "email": "utilisateur@example.com",
  "password": "motdepasse",
  "role": "staff" // Optionnel, par défaut "staff"
}
```

#### Connexion

```
POST /api/auth/login
```

Corps de la requête :

```json
{
  "username": "utilisateur",
  "password": "motdepasse"
}
```

#### Déconnexion

```
POST /api/auth/logout
```

Headers :

```
Authorization: Bearer <token>
```

#### Profil utilisateur

```
GET /api/auth/profile
```

Headers :

```
Authorization: Bearer <token>
```

### Gestion des employés

#### Récupérer tous les employés

```
GET /api/employees
```

Headers :

```
Authorization: Bearer <token>
```

#### Récupérer un employé par ID

```
GET /api/employees/:id
```

Headers :

```
Authorization: Bearer <token>
```

#### Créer un nouvel employé

```
POST /api/employees
```

Headers :

```
Authorization: Bearer <token>
```

Corps de la requête :

```json
{
  "prenom": "Jean",
  "nom": "Dupont",
  "fonction": "Développeur",
  "dateRecrutement": "2023-01-15",
  "statut": "active" // Optionnel, par défaut "active"
}
```

#### Mettre à jour un employé (Admin uniquement)

```
PUT /api/employees/:id
```

Headers :

```
Authorization: Bearer <token>
```

Corps de la requête :

```json
{
  "prenom": "Jean",
  "nom": "Dupont",
  "fonction": "Lead Développeur",
  "dateRecrutement": "2023-01-15",
  "statut": "active"
}
```

#### Supprimer un employé (Admin uniquement)

```
DELETE /api/employees/:id
```

Headers :

```
Authorization: Bearer <token>
```

## Utilisateur par défaut

Un utilisateur administrateur est créé par défaut lors de l'exécution des seeders :

- Username: admin
- Password: admin123
- Role: admin

## Licence

ISC