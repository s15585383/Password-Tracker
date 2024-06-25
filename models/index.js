const User = require("./User");
const Passwords = require("./Passwords");

User.hasMany(Passwords, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Passwords.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = { User, Passwords };
