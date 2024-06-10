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
    // Implement logic to retrieve passwords from database
    // Assuming user ID is available from the JWT token (req.user)
    const passwords = await getPasswordsByUserId(req.userId); // Replace with logic
    res.json(passwords);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// ... other routes (consider adding more for password management)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
