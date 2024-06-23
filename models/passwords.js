const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const create_users_and_passwords = require('./migrations/create_users_and_passwords')

dotenv.config(); // Load environment variables

console.log("in user: " + process.env.DB_HOST)
console.log("making db connection with config")

const Password = sequelize.define('Password', {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    username: {
      type: Sequelize.STRING,
    }, //  duplicate for display purposes
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    }, // Store hashed password
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
  });

  async function editPasswordRoute(req, res) {
    const passwordId = req.params.id; // Assuming password ID comes from request parameters
    const editedData = req.body; // Assuming edited data comes from request body
  
    try {
      await passwordService.editPassword(passwordId, editedData);
      res.status(200).json({ message: 'Password updated successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error editing password' });
    }
  }

  // Edit Password Functionality
async function editPassword(passwordId, editedData) {
    // Assuming editedData contains title, username, and password (hashed)
    try {
      const password = await Password.findByPk(passwordId);
  
      if (!password) {
        throw new Error('Password not found'); // Handle non-existent password
      }
  
      await password.update(editedData);
      console.log('Password updated successfully:', password);
    } catch (error) {
      console.error('Error editing password:', error);
      // Handle errors (e.g., display an error message to the user)
    }
  }
  module.exports = { User, Password, sequelize }; // Export the User model, password and Sequelize instance