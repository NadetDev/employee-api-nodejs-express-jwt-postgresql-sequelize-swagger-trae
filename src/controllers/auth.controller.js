const { User, Sequelize } = require('../models');
const { generateToken, blacklistToken } = require('../utils/jwt.utils');
const { Op } = Sequelize;

/**
 * Inscription d'un nouvel utilisateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
    }

    // Créer un nouvel utilisateur
    const newUser = await User.create({
      username,
      email,
      password,
      role: role || 'staff' // Par défaut, le rôle est 'staff'
    });

    // Générer un token JWT
    const { token, expiresAt } = await generateToken(newUser);

    // Retourner les informations de l'utilisateur et le token
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
      token,
      expiresAt
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
};

/**
 * Connexion d'un utilisateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Vérifier si l'utilisateur est actif
    if (!user.active) {
      return res.status(401).json({ message: 'Compte désactivé' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.validPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Générer un token JWT
    const { token, expiresAt } = await generateToken(user);

    // Retourner les informations de l'utilisateur et le token
    res.status(200).json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token,
      expiresAt
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
};

/**
 * Déconnexion d'un utilisateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.logout = async (req, res) => {
  try {
    const token = req.token;

    // Ajouter le token à la liste noire
    const blacklisted = await blacklistToken(token);

    if (blacklisted) {
      res.status(200).json({ message: 'Déconnexion réussie' });
    } else {
      res.status(400).json({ message: 'Erreur lors de la déconnexion' });
    }
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    res.status(500).json({ message: 'Erreur lors de la déconnexion' });
  }
};

/**
 * Récupérer le profil de l'utilisateur connecté
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.getProfile = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du profil' });
  }
};