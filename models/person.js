// models/person.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Person = sequelize.define('person', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
  },
}, {
  freezeTableName: true,
  timestamps: false,
});

module.exports = Person;
