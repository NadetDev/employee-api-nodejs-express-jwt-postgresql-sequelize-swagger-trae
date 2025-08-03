'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await queryInterface.bulkInsert('users', [{
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      active: true,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', { username: 'admin' }, {});
  }
};