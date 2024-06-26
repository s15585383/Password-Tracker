const { Model, DataTypes } = require("sequelize"); // Import Sequelize components
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const sequelize = require("../config/connection"); // Import the Sequelize instance

/**
 * Define the User model using Sequelize. This model represents user accounts
 * in the database.
 */
class User extends Model {
  /**
   * This method checks if the provided password (loginPw) matches the hashed password
   * stored in the model instance.
   *
   * @param {string} loginPw The plain text password to compare.
   * @returns {boolean} True if passwords match, false otherwise.
   */
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

// Define the schema and configuration for the User model
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Enforces no duplicate emails
      validate: {
        isEmail: true, // Ensures a valid email format
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8], // Minimum password length of 8 characters
      },
    },
  },
  {
    hooks: {
      beforeCreate: async (newUserData) => {
        /**
         * Hash the password before creating a new user.
         * This ensures only the hashed password is stored in the database.
         */
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      beforeUpdate: async (updatedUserData) => {
        /**
         * Hash the password before updating an existing user.
         * This ensures the updated password is also stored in a hashed form.
         */
        updatedUserData.password = await bcrypt.hash(
          updatedUserData.password,
          10
        );
        return updatedUserData;
      },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "user",
  }
);

module.exports = User;
