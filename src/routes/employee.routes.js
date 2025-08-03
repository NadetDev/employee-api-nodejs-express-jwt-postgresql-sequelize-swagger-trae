const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       required:
 *         - prenom
 *         - nom
 *         - fonction
 *         - dateRecrutement
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-généré de l'employé
 *         prenom:
 *           type: string
 *           description: Prénom de l'employé
 *         nom:
 *           type: string
 *           description: Nom de famille de l'employé
 *         fonction:
 *           type: string
 *           description: Poste occupé par l'employé
 *         dateRecrutement:
 *           type: string
 *           format: date
 *           description: Date de recrutement de l'employé
 *         statut:
 *           type: string
 *           enum: [active, absent, quitte]
 *           description: Statut actuel de l'employé
 *       example:
 *         prenom: Jean
 *         nom: Dupont
 *         fonction: Développeur
 *         dateRecrutement: 2023-01-15
 *         statut: active
 */

/**
 * @swagger
 * tags:
 *   name: Employés
 *   description: API de gestion des employés
 */

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Récupérer tous les employés
 *     tags: [Employés]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des employés récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/', verifyToken, employeeController.getAllEmployees);

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: Récupérer un employé par son ID
 *     tags: [Employés]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'employé
 *     responses:
 *       200:
 *         description: Employé récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Employé non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', verifyToken, employeeController.getEmployeeById);

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Créer un nouvel employé
 *     tags: [Employés]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *     responses:
 *       201:
 *         description: Employé créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 employee:
 *                   $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.post('/', verifyToken, isAdmin, employeeController.createEmployee);

/**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     summary: Mettre à jour un employé
 *     tags: [Employés]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'employé
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *     responses:
 *       200:
 *         description: Employé mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 employee:
 *                   $ref: '#/components/schemas/Employee'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé (rôle admin requis)
 *       404:
 *         description: Employé non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', verifyToken, isAdmin, employeeController.updateEmployee);

/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     summary: Supprimer un employé
 *     tags: [Employés]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'employé
 *     responses:
 *       200:
 *         description: Employé supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé (rôle admin requis)
 *       404:
 *         description: Employé non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', verifyToken, isAdmin, employeeController.deleteEmployee);

module.exports = router;