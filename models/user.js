const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// Sequelize Connection Details
const sequelize = new Sequelize({
  dialect: 'postgres', // Replace with your database dialect (e.g., 'mysql')
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// User Model Definition
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
});

//password model
const Password = sequelize.define('Password', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
  }, // Optional: duplicate for display purposes
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
};

// Registration Example (using separate user input)
async function registerUser(userInput) {
  const hashedPassword = await bcrypt.hash(userInput.password, 10); // Hash the password

  // Create a User instance with the hashed password
  const user = await User.create({
    username: userInput.username,
    passwordHash: hashedPassword,
  });

  // ... handle successful registration (e.g., return user object, send confirmation email)
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

// Test connection (Optional)
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to database established successfully.');
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1); // Exit process on connection failure
  }
})();

module.exports = { User, Password, sequelize }; // Export the User model, password and Sequelize instance