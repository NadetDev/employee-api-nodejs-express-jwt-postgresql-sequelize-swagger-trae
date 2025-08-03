module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    // Indentation à 2 espaces
    'indent': ['error', 2],
    // Utilisation de guillemets simples
    'quotes': ['error', 'single'],
    // Point-virgule obligatoire
    'semi': ['error', 'always'],
    // Pas d'espaces en fin de ligne
    //'no-trailing-spaces': 'error',
    // Pas de variables non utilisées
    'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    // Pas de console.log en production
    //'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    // Pas de debugger en production
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    // Pas de variables non déclarées
    'no-undef': 'error',
    // Pas d'espaces multiples
    'no-multi-spaces': 'error',
    // Pas de lignes vides multiples
    'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 1 }],
    // Pas de virgule en fin de liste
    //'comma-dangle': ['error', 'never'],
    // Espaces autour des opérateurs
    'space-infix-ops': 'error'
  }
};