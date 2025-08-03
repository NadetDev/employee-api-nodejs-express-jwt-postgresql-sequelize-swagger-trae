'use strict';

/**
 * @swagger
 * components:
 *   schemas:
 *     Token:
 *       type: object
 *       required:
 *         - token
 *         - userId
 *         - expiresAt
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-généré du token
 *         token:
 *           type: string
 *           description: Valeur unique du token JWT
 *         userId:
 *           type: integer
 *           description: ID de l'utilisateur associé au token
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           description: Date d'expiration du token
 *         blacklisted:
 *           type: boolean
 *           description: Indique si le token est sur liste noire (invalide)
 *       example:
 *         token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         userId: 1
 *         expiresAt: 2023-08-04T12:00:00.000Z
 *         blacklisted: false
 */
module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    blacklisted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'tokens',
    timestamps: true,
    underscored: true
  });

  Token.associate = (models) => {
    Token.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Token;
};