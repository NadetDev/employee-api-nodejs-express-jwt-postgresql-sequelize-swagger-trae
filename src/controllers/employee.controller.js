const { Employee } = require('../models');

/**
 * Récupérer tous les employés
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Erreur lors de la récupération des employés:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des employés' });
  }
};

/**
 * Récupérer un employé par son ID
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'employé:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'employé' });
  }
};

/**
 * Créer un nouvel employé
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.createEmployee = async (req, res) => {
  try {
    const { prenom, nom, fonction, dateRecrutement, statut } = req.body;

    // Validation des données
    if (!prenom || !nom || !fonction || !dateRecrutement) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }

    // Créer un nouvel employé
    const newEmployee = await Employee.create({
      prenom,
      nom,
      fonction,
      dateRecrutement,
      statut: statut || 'active'
    });

    res.status(201).json({
      message: 'Employé créé avec succès',
      employee: newEmployee
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'employé:', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'employé' });
  }
};

/**
 * Mettre à jour un employé
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { prenom, nom, fonction, dateRecrutement, statut } = req.body;

    // Vérifier si l'employé existe
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }

    // Mettre à jour l'employé
    await employee.update({
      prenom: prenom || employee.prenom,
      nom: nom || employee.nom,
      fonction: fonction || employee.fonction,
      dateRecrutement: dateRecrutement || employee.dateRecrutement,
      statut: statut || employee.statut
    });

    res.status(200).json({
      message: 'Employé mis à jour avec succès',
      employee
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'employé:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'employé' });
  }
};

/**
 * Supprimer un employé
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si l'employé existe
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }

    // Supprimer l'employé
    await employee.destroy();

    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'employé:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'employé' });
  }
};