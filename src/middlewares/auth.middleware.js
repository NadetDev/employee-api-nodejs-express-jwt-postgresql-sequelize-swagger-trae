const jwt = require('jsonwebtoken');
const { User, Token } = require('../models');

/**
 * Middleware pour vérifier si l'utilisateur est authentifié
 */
exports.verifyToken = async (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Aucun token fourni' });
    }

    const token = authHeader.split(' ')[1];

    // Vérifier si le token est dans la liste noire (déconnecté)
    const blacklistedToken = await Token.findOne({ where: { token, blacklisted: true } });
    if (blacklistedToken) {
      return res.status(401).json({ message: 'Token invalide ou expiré' });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier si l'utilisateur existe toujours et est actif
    const user = await User.findByPk(decoded.id);
    if (!user || !user.active) {
      return res.status(401).json({ message: 'Utilisateur non trouvé ou inactif' });
    }

    // Ajouter l'utilisateur à l'objet request
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré' });
    }
    return res.status(401).json({ message: 'Non autorisé' });
  }
};

/**
 * Middleware pour vérifier si l'utilisateur est un administrateur
 */
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé. Rôle administrateur requis.' });
  }
};