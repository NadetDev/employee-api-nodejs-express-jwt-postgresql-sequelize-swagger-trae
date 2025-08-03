# API de Gestion des Employés

Une API RESTful pour la gestion des employés, construite avec Express.js, PostgreSQL et JWT pour l'authentification.

## Fonctionnalités

- Authentification des utilisateurs avec JWT
- Gestion des rôles (admin, staff)
- Gestion des employés (CRUD)
- Déconnexion avec invalidation des tokens
- Expiration des tokens après 24h

## Prérequis

- Node.js (v14 ou supérieur)
- PostgreSQL

## Installation

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

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

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