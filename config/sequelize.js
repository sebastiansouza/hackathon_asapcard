const { Sequelize } = require('sequelize');
const config = require('./config.json');

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: 'postgres',
    dialectOptions:{
      connectTimeout: 6000000,
    }
  }
);

module.exports = sequelize;
