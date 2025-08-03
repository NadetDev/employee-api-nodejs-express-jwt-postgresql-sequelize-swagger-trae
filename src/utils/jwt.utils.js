const jwt = require('jsonwebtoken');
const { Token } = require('../models');

/**
 * Génère un nouveau token JWT
 * @param {Object} user - L'utilisateur pour lequel générer le token
 * @returns {Object} - Objet contenant le token et sa date d'expiration
 */
exports.generateToken = async (user) => {
  // Calculer la date d'expiration (24h)
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  // Créer le payload du token
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };

  // Générer le token
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

  // Enregistrer le token dans la base de données
  await Token.create({
    token,
    userId: user.id,
    expiresAt,
    blacklisted: false
  });

  return {
    token,
    expiresAt
  };
};

/**
 * Ajoute un token à la liste noire (déconnexion)
 * @param {string} token - Le token à blacklister
 * @returns {boolean} - True si le token a été blacklisté avec succès
 */
exports.blacklistToken = async (token) => {
  try {
    const tokenRecord = await Token.findOne({ where: { token } });
    if (tokenRecord) {
      tokenRecord.blacklisted = true;
      await tokenRecord.save();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erreur lors du blacklisting du token:', error);
    return false;
  }
};