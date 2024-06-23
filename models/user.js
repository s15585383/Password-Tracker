const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const create_users_and_passwords = require('./migrations/create_users_and_passwords')


// User Model Definition (user info for accessing their account)
const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: true, // Optional username
  },
  passwordHash: {
    type: Sequelize.STRING,
    allowNull: false,
  },
    email: {
      type: Sequelize.STRING,
      allowNull: false, // Make email mandatory
      unique: true, // Ensure unique email addresses
  },
});


// Hook to hash password before saving (if creating a new user)
User.beforeCreate(async (user) => {
  if (user.masterPassword) { // Not recommended for user input anymore
    console.warn('masterPassword field is not recommended for user input. Use separate hashing logic.');
  }
  // Check if user provides a password before hashing
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(user.password, salt);
    delete user.password; // Remove plain text password after hashing
  }
});

// Separate User Input Object Example (for Registration or Login)
const userInput = {
  username: '', // User-provided username
  password: '', // User-provided password (plain text)
  email: '',  // User-provided email address
};


// Registration Example (using separate user input)
async function registerUser(userInput) {
  const hashedPassword = await bcrypt.hash(userInput.password, 10);

  // Create a User instance with email and hashed password
  const user = await User.create({
    username: userInput.username,
    passwordHash: hashedPassword,
    email: userInput.email, 
  });
  console.log('User registered successfully:', user);
  return user;
}


// Login Example (Optional)
async function loginUser(userInput) {
  const user = await User.findOne({ where: { username: userInput.username } });

  if (!user) {
    // Handle invalid username case (e.g., return error message)
    return { success: false, message: 'Invalid username or password' };
  }

  const passwordMatch = await bcrypt.compare(userInput.password, user.passwordHash);

  if (!passwordMatch) {
    // Handle invalid password case (e.g., return error message)
    return { success: false, message: 'Invalid username or password' };
  }

  // Login successful (replace with your login logic)
  return { success: true, user: user }; // Return user object or relevant information
}



module.exports = { User, Password, sequelize }; // Export the User model, password and Sequelize instance
