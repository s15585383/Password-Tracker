const { Model, DataTypes } = require("sequelize"); // Import Sequelize components
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const sequelize = require("../config/connection"); // Import the Sequelize instance

/**
 * Define the Passwords model using Sequelize. This model represents password entries
 * for users in the database.
 */
class Password extends Model {
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

// Define the schema and configuration for the Passwords model
Password.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Store the hashed password, not the plain text password
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    hooks: {
      beforeCreate: async (newPasswordData) => {
        /**
         * Hash the password before creating a new password entry.
         * This ensures only the hashed password is stored in the database.
         */
        newPasswordData.password = await bcrypt.hash(
          newPasswordData.password,
          10
        );
        return newPasswordData;
      },
      beforeUpdate: async (updatedPasswordData) => {
        /**
         * Hash the password before updating an existing password entry.
         * This ensures the updated password is also stored in a hashed form.
         */
        updatedPasswordData.password = await bcrypt.hash(
          updatedPasswordData.password,
          10
        );
        return updatedPasswordData;
      },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "passwords",
  }
);

module.exports = Password;
