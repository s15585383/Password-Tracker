const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/connection");

class User extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

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
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8],
      },
    },
  },
  {
    hooks: {
      beforeCreate: async (newUserData) => {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      beforeUpdate: async (updatedUserData) => {
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

// Hook to hash password before saving (if creating a new user)
// User.beforeCreate(async (user) => {
//   if (user.masterPassword) { // Not recommended for user input anymore
//     console.warn('masterPassword field is not recommended for user input. Use separate hashing logic.');
//   }
//   // Check if user provides a password before hashing
//   if (user.password) {
//     const salt = await bcrypt.genSalt(10);
//     user.passwordHash = await bcrypt.hash(user.password, salt);
//     delete user.password; // Remove plain text password after hashing
//   }
// });

// // Separate User Input Object Example (for Registration or Login)
// const userInput = {
//   username: '', // User-provided username
//   password: '', // User-provided password (plain text)
//   email: '',  // User-provided email address
// };

// // Registration Example (using separate user input)
// async function registerUser(userInput) {
//   const hashedPassword = await bcrypt.hash(userInput.password, 10);

//   // Create a User instance with email and hashed password
//   const user = await User.create({
//     username: userInput.username,
//     passwordHash: hashedPassword,
//     email: userInput.email,
//   });
//   console.log('User registered successfully:', user);
//   return user;
// }

// // Login Example (Optional)
// async function loginUser(userInput) {
//   const user = await User.findOne({ where: { username: userInput.username } });

//   if (!user) {
//     // Handle invalid username case (e.g., return error message)
//     return { success: false, message: 'Invalid username or password' };
//   }

//   const passwordMatch = await bcrypt.compare(userInput.password, user.passwordHash);

//   if (!passwordMatch) {
//     // Handle invalid password case (e.g., return error message)
//     return { success: false, message: 'Invalid username or password' };
//   }

//   // Login successful (replace with your login logic)
//   return { success: true, user: user }; // Return user object or relevant information
// }

// module.exports = User
