const express = require('express');
const router = express.Router(); // Use a separate router for login
const bcrypt = require('bcryptjs'); // For password hashing
const User = require('../models/user'); 
const jwt = require('jsonwebtoken'); // For JWT generation

// ... other imports and setup (if needed)

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check for existing user with username or email 
    const existingUser = await User.findOne({
      where: { username: username }, // Check for username conflict
    });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (email) { // Check for email conflict if storing email
      const existingEmail = await User.findOne({ where: { email: email } });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with hashed password and email 
    const user = await User.create({
      username,
      email, 
      password: hashedPassword,
    });

    // Registration successful, generate a JWT token
    const token = generateJwtToken(user.id); // Replace with JWT generation logic

    res.json({ message: "Registration successful", token, userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Implement JWT generation function 
function generateJwtToken(userId) {
  const payload = { userId }; // Payload containing the user ID
  const secret = process.env.JWT_SECRET; // Access the secret key from environment variable
  const options = {
    expiresIn: '30m', // Set expiration time for the token (30 minutes)
  };

  return jwt.sign(payload, secret, options);
}


module.exports = router; // Export the router for use in app.js
