// migrations/xxxxxx-create-person.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('person', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.STRING, // ou Sequelize.DataTypes.UUID, dependendo do seu caso
      },
      name: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      age: {
        type: Sequelize.DataTypes.INTEGER,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('person');
  },
};
