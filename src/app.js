require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Swagger
const swagger = require('./config/swagger');

// Routes
const authRoutes = require('./routes/auth.routes');
const employeeRoutes = require('./routes/employee.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentation Swagger
app.use('/api-docs', swagger.serve, swagger.setup);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

// Route de base
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenue sur l\'API de gestion des employés',
    documentation: '/api-docs'
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

module.exports = app;