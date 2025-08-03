const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', verifyToken, employeeController.getAllEmployees);
router.get('/:id', verifyToken, employeeController.getEmployeeById);
router.post('/', verifyToken, employeeController.createEmployee);

// Routes accessibles uniquement aux administrateurs
router.put('/:id', verifyToken, isAdmin, employeeController.updateEmployee);
router.delete('/:id', verifyToken, isAdmin, employeeController.deleteEmployee);

module.exports = router;