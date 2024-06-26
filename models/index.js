const User = require("./User"); // Import the User model definition
const Password = require("./Password"); // Import the Passwords model definition

/**
 * Define a one-to-many relationship between User and Passwords models using Sequelize associations.
 *  - A User can have many Passwords (one-to-many relationship).
 *  - A Password belongs to one User.
 *  - When a User is deleted (CASCADE), all their associated Passwords are also deleted.
 */
User.hasMany(Password, {
  foreignKey: "userId", // Foreign key in the Passwords table referencing the User model
  onDelete: "CASCADE", // Delete associated passwords when a User is deleted
});

Password.belongsTo(User, {
  foreignKey: "userId", // Foreign key in the Passwords table referencing the User model
});

module.exports = { User, Password }; // Export both User and Passwords models
