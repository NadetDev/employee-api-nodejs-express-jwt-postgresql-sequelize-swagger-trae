module.exports = {
  // Indique l'environnement dans lequel les tests seront exécutés
  testEnvironment: 'node',
  
  // Répertoires à ignorer lors de la recherche de tests
  testPathIgnorePatterns: ['/node_modules/'],
  
  // Fichiers à transformer avant les tests
  transform: {},
  
  // Patterns pour trouver les fichiers de test
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  
  // Couverture de code
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!src/migrations/**',
    '!src/seeders/**',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  
  // Timeout pour les tests (en millisecondes)
  testTimeout: 10000,
  
  // Afficher les détails des tests
  verbose: true,
};