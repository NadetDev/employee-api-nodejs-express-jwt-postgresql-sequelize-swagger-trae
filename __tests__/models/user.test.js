const { User } = require('../../src/models');
const { sequelize } = require('../../src/models');
const bcrypt = require('bcryptjs');

describe('User Model', () => {
  beforeAll(async () => {
    // Synchroniser la base de données en mémoire avant les tests
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Fermer la connexion à la base de données après les tests
    await sequelize.close();
  });

  it('should create a user successfully', async () => {
    // Données de test
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!',
      role: 'user',
      active: true
    };

    // Créer un utilisateur
    const user = await User.create(userData);

    // Vérifier que l'utilisateur a été créé avec les bonnes données
    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.username).toBe(userData.username);
    expect(user.email).toBe(userData.email);
    expect(user.role).toBe(userData.role);
    expect(user.active).toBe(userData.active);
    
    // Vérifier que le mot de passe a été haché
    expect(user.password).not.toBe(userData.password);
    
    // Vérifier que le mot de passe haché est valide
    const isPasswordValid = await bcrypt.compare(userData.password, user.password);
    expect(isPasswordValid).toBe(true);
  });

  it('should not create a user with an existing email', async () => {
    // Créer un premier utilisateur
    await User.create({
      username: 'user1',
      email: 'duplicate@example.com',
      password: 'Password123!',
      role: 'user',
      active: true
    });

    // Tenter de créer un utilisateur avec le même email
    try {
      await User.create({
        username: 'user2',
        email: 'duplicate@example.com', // Email en double
        password: 'Password456!',
        role: 'user',
        active: true
      });
      // Si la création réussit, le test échoue
      expect(true).toBe(false);
    } catch (error) {
      // Vérifier que l'erreur est bien liée à la contrainte d'unicité
      expect(error).toBeDefined();
      expect(error.name).toBe('SequelizeUniqueConstraintError');
    }
  });

  it('should validate password correctly', async () => {
    // Créer un utilisateur pour le test
    const user = await User.create({
      username: 'passwordtest',
      email: 'password@example.com',
      password: 'SecurePassword123!',
      role: 'user',
      active: true
    });

    // Vérifier que la méthode validPassword fonctionne correctement
    const validPassword = await user.validPassword('SecurePassword123!');
    const invalidPassword = await user.validPassword('WrongPassword');

    expect(validPassword).toBe(true);
    expect(invalidPassword).toBe(false);
  });

  it('should update a user successfully', async () => {
    // Créer un utilisateur pour le test
    const user = await User.create({
      username: 'updatetest',
      email: 'update@example.com',
      password: 'Password123!',
      role: 'user',
      active: true
    });

    // Nouvelles données
    const newData = {
      username: 'updateduser',
      role: 'admin',
      password: 'NewPassword456!'
    };

    // Mettre à jour l'utilisateur
    await user.update(newData);

    // Recharger l'utilisateur depuis la base de données
    await user.reload();

    // Vérifier que les données ont été mises à jour
    expect(user.username).toBe(newData.username);
    expect(user.role).toBe(newData.role);
    
    // Vérifier que le mot de passe a été mis à jour et haché
    const isNewPasswordValid = await bcrypt.compare(newData.password, user.password);
    expect(isNewPasswordValid).toBe(true);
    
    // Vérifier que l'ancien mot de passe n'est plus valide
    const isOldPasswordValid = await bcrypt.compare('Password123!', user.password);
    expect(isOldPasswordValid).toBe(false);
  });
});