const app = require('./app');
const { sequelize } = require('./models');
const PORT = process.env.PORT || 3000;

// Démarrage du serveur
async function startServer() {
  try {
    // Synchronisation avec la base de données
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');
    
    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
  }
}

startServer();