const express = require('express');
const { User, Password } = require('./user.model.js'); // Assuming user.model.js location
const loginRouter = require('./controllers/login'); // Assuming controllers folder
const cors = require('cors'); // Optional, for allowing cross-origin requests
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Include bcrypt for password hashing

// ... other imports (Sequelize, etc.)

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port

// Enable CORS if needed for cross-origin requests (adjust origins as needed)
app.use(cors({ origin: 'http://localhost:3001' })); // Assuming frontend on 3001

// Parse incoming JSON data
app.use(express.json());

// Login route using the imported login controller
app.use('/auth', loginRouter);

// Function to verify JWT token
function verifyJwtToken(req, res, next) {
  const authHeader = req.headers.authorization;

  // Check if authorization header is present and formatted correctly
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send("Unauthorized: Access denied");
  }

  const token = authHeader.split(' ')[1]; // Extract token from header

  // Verify the token using jsonwebtoken.verify
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send("Unauthorized: Invalid token");
    }

    // Token is valid, attach decoded user data to the request object (optional)
    req.user = decoded;
    next(); // Proceed with the request if token is valid
  });
}

// User registration route

// ... other imports and existing routes ...
const authorizeUser = async (req, res, next) => {
  try {
    const passwordId = req.params.id; // Extract password ID from request params (if applicable)
    const userId = req.user.id; // Assuming user ID is stored in req.user

    // Check if password entry exists and belongs to the logged-in user
    const password = await Password.findByPk(passwordId, {
      include: [{
        model: User,
        where: { id: userId }, // Filter by logged-in user
      }],
    });

    if (!password) {
      return res.status(401).send("Unauthorized: Access denied");
    }

    next(); // Continue to the route handler if authorized
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Adjust salt rounds as needed

    // Create a new user
    const user = await User.create({ username, passwordHash: hashedPassword });

    //generate JWT token on signup

    res.status(201).json({ message: "User created successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


// Protected routes (require JWT authorization)
app.get('/passwords', authorizeUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const passwords = await Password.findAll({ where: { userId } });

    res.json(passwords);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
app.get('/passwords/:id', authorizeUser, async (req, res) => {
  try {
    const passwordId = req.params.id;

    const password = await Password.findByPk(passwordId); // Fetch specific entry

    if (!password) {
      return res.status(404).send("Password not found"); // Handle non-existent entry
    }

    res.json(password);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});



// Assuming 'User' model is imported from user.model.js

app.post('/register', async (req, res) => {
  const { username, masterPassword } = req.body;
  try {
    const newUser = await User.create({ username, masterPassword }); // Hash password before storing
    res.json({ message: 'User created successfully!', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).send("Login failed"); // Generic message
    }

    // ... successful login processing (generate JWT token, etc.) ...
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


// Protected route for creating a password (POST)
app.post('/passwords', async (req, res) => {
  try {
    const { title, username, password } = req.body;
    const userId = req.user.id; // Assuming user ID is stored in req.user

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const newPassword = await Password.create({ title, username, password: hashedPassword, userId });

    res.status(201).json({ message: "Password created successfully", newPassword });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


// Protected route for updating a password (PUT)
app.put('/passwords/:id', authorizeUser, async (req, res) => {
  try {
    const passwordId = req.params.id;
    const { title, username, password } = req.body; // Updated details (optional)

    const existingPassword = await Password.findByPk(passwordId);

    if (!existingPassword) {
      return res.status(404).send("Password not found");
    }

    const updatedData = {}; // Object to store updated fields

    if (title) updatedData.title = title;
    if (username) updatedData.username = username;
    if (password) updatedData.password = await bcrypt.hash(password, 10);

    await existingPassword.update(updatedData);

    const updatedPassword = await Password.findByPk(passwordId); // Fetch updated entry

    res.json({ message: "Password updated successfully", updatedPassword });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


// Protected route for deleting a password (DELETE)
app.delete('/passwords/:id', verifyJwtToken, async (req, res) => {
  try {
    // Extract password ID from route parameter
    const passwordId = req.params.id;

    // Find the password to delete
    const password = await Password.findByPk(passwordId);

    // Check if password exists
    if (!password) {
      return res.status(404).send("Password not found");
    }

    // Verify user authorization (password belongs to the user)
    if (password.userId !== req.user.id) {
      return res.status(401).send("Unauthorized: You cannot delete this password");
    }

    // Delete the password entry
    await password.destroy();

    // Send success message
    res.json({ message: "Password deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// ... other routes (consider adding more for password management)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

async function getPasswordsByUserId(userId) {
  try {
    // Use Sequelize to find passwords associated with the user ID
    const passwords = await Password.findAll({
      where: { userId }, // Find passwords where userId matches
    });
    return passwords; // Return the retrieved passwords
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error for handling in the route
  }
};