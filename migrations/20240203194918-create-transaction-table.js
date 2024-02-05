// migrations/xxxxxx-create-transaction.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaction', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      transactionDate: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      amount: {
        allowNull: false,
        type: Sequelize.DataTypes.DECIMAL(10, 2),
      },
      numInstallments: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
      },
      personId: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        references: {
          model: 'person',
          key: 'id',
        },
      },
      status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pendente',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transaction');
  },
};
