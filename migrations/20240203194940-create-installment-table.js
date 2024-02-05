// migrations/xxxxxx-create-installment.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('installment', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      transactionId: {
        allowNull: false,
        type: Sequelize.DataTypes.UUID,
        references: {
          model: 'transaction',
          key: 'id',
        },
      },
      installmentNumber: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
      },
      value: {
        allowNull: false,
        type: Sequelize.DataTypes.DECIMAL(10, 2),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('installment');
  },
};
