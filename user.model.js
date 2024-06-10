const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs'); // Install bcrypt for password hashing

const sequelize = require('./database'); // Assuming your config file

const Password = sequelize.define('Password', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  website: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  hashedPassword: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
module.exports = Password;