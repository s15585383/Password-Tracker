const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/connection");

class Passwords extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

Passwords.init(
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
    }, //  duplicate for display purposes
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }, // Store hashed password
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
        newPasswordData.password = await bcrypt.hash(
          newPasswordData.password,
          10
        );
        return newPasswordData;
      },
      beforeUpdate: async (updatedPasswordData) => {
        updatedUserData.password = await bcrypt.hash(
          updatedPasswordData.password,
          10
        );
        return updatedUserData;
      },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "passwords",
  }
);

module.exports = Passwords;
