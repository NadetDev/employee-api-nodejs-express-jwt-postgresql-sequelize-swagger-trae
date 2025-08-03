const { Employee } = require('../../src/models');
const { sequelize } = require('../../src/models');

describe('Employee Model', () => {
  beforeAll(async () => {
    // Synchroniser la base de données en mémoire avant les tests
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Fermer la connexion à la base de données après les tests
    await sequelize.close();
  });

  it('should create an employee successfully', async () => {
    // Données de test
    const employeeData = {
      prenom: 'Jean',
      nom: 'Dupont',
      fonction: 'Développeur',
      dateRecrutement: new Date(),
      statut: 'actif'
    };

    // Créer un employé
    const employee = await Employee.create(employeeData);

    // Vérifier que l'employé a été créé avec les bonnes données
    expect(employee).toBeDefined();
    expect(employee.id).toBeDefined();
    expect(employee.prenom).toBe(employeeData.prenom);
    expect(employee.nom).toBe(employeeData.nom);
    expect(employee.fonction).toBe(employeeData.fonction);
    expect(employee.statut).toBe(employeeData.statut);
  });

  it('should not create an employee without required fields', async () => {
    // Données de test incomplètes
    const employeeData = {
      prenom: 'Marie',
      // nom manquant
      fonction: 'Designer'
    };

    // Tenter de créer un employé sans tous les champs requis
    try {
      await Employee.create(employeeData);
      // Si la création réussit, le test échoue
      expect(true).toBe(false);
    } catch (error) {
      // Vérifier que l'erreur est bien liée à la validation
      expect(error).toBeDefined();
      expect(error.name).toBe('SequelizeValidationError');
    }
  });

  it('should update an employee successfully', async () => {
    // Créer un employé pour le test
    const employee = await Employee.create({
      prenom: 'Pierre',
      nom: 'Martin',
      fonction: 'Chef de projet',
      dateRecrutement: new Date(),
      statut: 'actif'
    });

    // Nouvelles données
    const newData = {
      fonction: 'Directeur technique',
      statut: 'inactif'
    };

    // Mettre à jour l'employé
    await employee.update(newData);

    // Recharger l'employé depuis la base de données
    await employee.reload();

    // Vérifier que les données ont été mises à jour
    expect(employee.fonction).toBe(newData.fonction);
    expect(employee.statut).toBe(newData.statut);
    // Vérifier que les autres champs n'ont pas changé
    expect(employee.prenom).toBe('Pierre');
    expect(employee.nom).toBe('Martin');
  });

  it('should delete an employee successfully', async () => {
    // Créer un employé pour le test
    const employee = await Employee.create({
      prenom: 'Sophie',
      nom: 'Dubois',
      fonction: 'Ressources Humaines',
      dateRecrutement: new Date(),
      statut: 'actif'
    });

    // Récupérer l'ID pour vérification ultérieure
    const employeeId = employee.id;

    // Supprimer l'employé
    await employee.destroy();

    // Tenter de récupérer l'employé supprimé
    const deletedEmployee = await Employee.findByPk(employeeId);

    // Vérifier que l'employé n'existe plus
    expect(deletedEmployee).toBeNull();
  });
});