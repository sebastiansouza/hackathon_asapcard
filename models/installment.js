// models/installment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Installment = sequelize.define('installment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  transactionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'transaction',
      key: 'id',
    },
  },
  installmentNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  freezeTableName: true,
  timestamps: false,
});

module.exports = Installment;
