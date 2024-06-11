const express = require('express');
const loginRouter = require('./controllers/login'); // Assuming controllers folder
const cors = require('cors'); // Optional, for allowing cross-origin requests
const jwt = require('jsonwebtoken'); // Require jsonwebtoken library

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

// Protected route example (requires JWT authorization before access)
app.get('/passwords', verifyJwtToken, async (req, res) => {
  try {
    // Extract user ID from decoded JWT token
    const userId = req.user.id;

    // Find all passwords associated with the user ID
    const passwords = await Password.findAll({ where: { userId } });

    // Send retrieved passwords in the response
    res.json(passwords);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Protected route for creating a password (POST)
app.post('/passwords', verifyJwtToken, async (req, res) => {
  try {
    // Extract password data from request body
    const { title, url, username } = req.body;

    // Extract user ID from decoded JWT token
    const userId = req.user.id;

    // Create a new password entry with user association
    const newPassword = await Password.create({ title, url, username, userId });

    // Send success message or the created password object
    res.json({ message: "Password created successfully", password: newPassword });
  } catch (error) {
    console.error(error);

    // Handle potential errors (e.g., validation errors)
    if (error.name === 'SequelizeValidationError') {
      res.status(400).send("Bad Request: " + error.message);
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});

// Protected route for updating a password (PUT)
app.put('/passwords/:id', verifyJwtToken, async (req, res) => {
  try {
    // Extract password ID from route parameter
    const passwordId = req.params.id;

    // Extract update data from request body (optional)
    const { title, url, username } = req.body;

    // Find the password to update
    const password = await Password.findByPk(passwordId);

    // Check if password exists
    if (!password) {
      return res.status(404).send("Password not found");
    }

    // Verify user authorization (password belongs to the user)
    if (password.userId !== req.user.id) {
      return res.status(401).send("Unauthorized: You cannot modify this password");
    }

    // Update the password data
    await password.update({ title, url, username });

    // Send success message or the updated password object
    res.json({ message: "Password updated successfully", password });
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
}