const request = require('supertest');
const app = require('../../src/app');
const { sequelize, User, Employee } = require('../../src/models');
const jwt = require('jsonwebtoken');

describe('Employee Routes', () => {
  let token;
  let adminToken;
  let employeeId;

  beforeAll(async () => {
    // Synchroniser la base de données en mémoire avant les tests
    await sequelize.sync({ force: true });

    // Créer un utilisateur standard pour les tests
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!',
      role: 'user',
      active: true
    });

    // Créer un utilisateur admin pour les tests
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'AdminPass123!',
      role: 'admin',
      active: true
    });

    // Générer des tokens JWT pour les tests
    token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    adminToken = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    // Créer un employé pour les tests
    const employee = await Employee.create({
      prenom: 'Jean',
      nom: 'Dupont',
      fonction: 'Développeur',
      dateRecrutement: new Date(),
      statut: 'actif'
    });

    employeeId = employee.id;
  });

  afterAll(async () => {
    // Fermer la connexion à la base de données après les tests
    await sequelize.close();
  });

  describe('GET /api/employees', () => {
    it('should return all employees for authenticated users', async () => {
      const response = await request(app)
        .get('/api/employees')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return 401 for unauthenticated requests', async () => {
      const response = await request(app).get('/api/employees');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/employees/:id', () => {
    it('should return a specific employee by ID', async () => {
      const response = await request(app)
        .get(`/api/employees/${employeeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', employeeId);
      expect(response.body).toHaveProperty('prenom', 'Jean');
      expect(response.body).toHaveProperty('nom', 'Dupont');
    });

    it('should return 404 for non-existent employee', async () => {
      const response = await request(app)
        .get('/api/employees/999999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/employees', () => {
    it('should create a new employee for admin users', async () => {
      const newEmployee = {
        prenom: 'Marie',
        nom: 'Martin',
        fonction: 'Designer',
        dateRecrutement: new Date().toISOString(),
        statut: 'actif'
      };

      const response = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newEmployee);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('employee');
      expect(response.body.employee).toHaveProperty('id');
      expect(response.body.employee).toHaveProperty('prenom', newEmployee.prenom);
      expect(response.body.employee).toHaveProperty('nom', newEmployee.nom);
    });

    it('should return 403 for non-admin users', async () => {
      const newEmployee = {
        prenom: 'Pierre',
        nom: 'Dubois',
        fonction: 'Comptable',
        dateRecrutement: new Date().toISOString(),
        statut: 'actif'
      };

      const response = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${token}`)
        .send(newEmployee);

      expect(response.status).toBe(403);
    });
  });

  describe('PUT /api/employees/:id', () => {
    it('should update an employee for admin users', async () => {
      const updatedData = {
        fonction: 'Senior Développeur',
        statut: 'inactif'
      };

      const response = await request(app)
        .put(`/api/employees/${employeeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('employee');
      expect(response.body.employee).toHaveProperty('fonction', updatedData.fonction);
      expect(response.body.employee).toHaveProperty('statut', updatedData.statut);
    });

    it('should return 403 for non-admin users', async () => {
      const updatedData = {
        fonction: 'Développeur Junior'
      };

      const response = await request(app)
        .put(`/api/employees/${employeeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/employees/:id', () => {
    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .delete(`/api/employees/${employeeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });

    it('should delete an employee for admin users', async () => {
      const response = await request(app)
        .delete(`/api/employees/${employeeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(204);

      // Vérifier que l'employé a bien été supprimé
      const getResponse = await request(app)
        .get(`/api/employees/${employeeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(getResponse.status).toBe(404);
    });
  });
});