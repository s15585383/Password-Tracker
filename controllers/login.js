const express = require('express');
const router = express.Router(); // Use a separate router for login
const bcrypt = require('bcryptjs'); // For password hashing
const User = require('../models/User'); // Assuming your User model is in models folder
const jwt = require('jsonwebtoken'); // For JWT generation

// ... other imports and setup (if needed)

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body; // Get username and password from request body

    // Find user by username using Sequelize model
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Username not found" }); // Unauthorized (more specific message)
    }

    // Verify password using bcrypt.compare (assuming hashed password in user.password)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" }); // Unauthorized (more specific message)
    }

    // Login successful, generate a JWT token
    const token = generateJwtToken(user.id); // Replace with JWT generation logic

    res.json({ message: "Login successful", token, userId: user.id }); // More informative response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" }); // Handle errors gracefully
  }
});

// Implement JWT generation function using jsonwebtoken library
function generateJwtToken(userId) {
  const payload = { userId }; // Payload containing the user ID
  const secret = process.env.JWT_SECRET; // Access the secret key from environment variable
  const options = {
    expiresIn: '30m', // Set expiration time for the token (e.g., 30 minutes)
  };

  return jwt.sign(payload, secret, options);
}


module.exports = router; // Export the router for use in app.js
