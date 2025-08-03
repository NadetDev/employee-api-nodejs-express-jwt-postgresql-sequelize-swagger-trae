require('dotenv').config();
const { Client } = require('pg');

async function createTestDatabase() {
  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: 'employee_management_test' // Se connecter à la base postgres par défaut
  });

  try {
    await client.connect();
    console.log('Connecté à PostgreSQL');

    const testDbName = `${process.env.DB_NAME}_test`;
    
    // Vérifier si la base de données existe déjà
    const checkResult = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [testDbName]
    );

    // Si la base de données n'existe pas, la créer
    if (checkResult.rows.length === 0) {
      console.log(`Création de la base de données ${testDbName}...`);
      await client.query(`CREATE DATABASE ${testDbName}`);
      console.log(`Base de données ${testDbName} créée avec succès.`);
    } else {
      console.log(`La base de données ${testDbName} existe déjà.`);
    }
  } catch (err) {
    console.error('Erreur lors de la création de la base de données de test:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createTestDatabase();