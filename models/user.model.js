const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

const sequelize = require('./database'); // Assuming your config file

// User Model
const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: true, // Username might be optional
  },
  passwordHash: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  masterPassword: { // Include the field for user input (optional)
    type: Sequelize.STRING,
    allowNull: true,
  },
});

// Hook to hash password before saving (if creating a new user)
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.passwordHash = await bcrypt.hash(user.masterPassword, salt);
  delete user.masterPassword; // Remove plain text password after hashing
});

// Password Model
const Password = sequelize.define('Password', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  url: {
    type: Sequelize.STRING,
  },
  username: {
    type: Sequelize.STRING,
  },
  userId: {
    type: Sequelize.INTEGER,
    references: {
      model: User, // Reference the User model
      key: 'id',
    },
  },
});

// Association (Optional, but recommended)
User.hasMany(Password, { foreignKey: 'userId' }); // A user can have many passwords

module.exports = { User, Password }; // Export both models
