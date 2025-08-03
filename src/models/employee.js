'use strict';

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