// models/transaction.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Transaction = sequelize.define('transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  numInstallments: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  personId: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: 'person',
      key: 'id',
    },
  },
  status: {  // Nova coluna 'status'
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  freezeTableName: true,
  timestamps: false,
});

module.exports = Transaction;
