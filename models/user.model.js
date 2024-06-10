const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

const sequelize = require('./database'); // Assuming your config file

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  hashedMasterPassword: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Hook to hash password before saving (if creating a new user)
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.hashedMasterPassword = await bcrypt.hash(user.masterPassword, salt);
  delete user.masterPassword; // Remove plain text password after hashing
});

module.exports = User;