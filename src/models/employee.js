'use strict';

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
module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fonction: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dateRecrutement: {
      type: DataTypes.DATE,
      allowNull: false
    },
    statut: {
      type: DataTypes.ENUM('active', 'absent', 'quitte'),
      defaultValue: 'active',
      allowNull: false
    }
  }, {
    tableName: 'employees',
    timestamps: true,
    underscored: true
  });

  return Employee;
};