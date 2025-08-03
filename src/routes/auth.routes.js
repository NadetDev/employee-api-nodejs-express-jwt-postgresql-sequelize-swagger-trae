const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Route d'inscription
router.post('/register', authController.register);

// Route de connexion
router.post('/login', authController.login);

// Route de déconnexion (nécessite d'être authentifié)
router.post('/logout', verifyToken, authController.logout);

// Route pour récupérer le profil de l'utilisateur connecté
router.get('/profile', verifyToken, authController.getProfile);

module.exports = router;