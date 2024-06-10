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

// Hook to hash password before saving
Password.beforeCreate(async (password) => {
  const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
  password.hashedPassword = await bcrypt.hash(password.password, salt); // Hash the password with the salt
  delete password.password; // Remove plain text password after hashing
});

module.exports = Password;