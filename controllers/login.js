const express = require('express');
const router = express.Router(); // Use a separate router for login
const bcrypt = require('bcryptjs'); // For password hashing
const User = require('../models/User'); // Assuming your User model is in models folder

// ... other imports and setup (if needed)

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body; // Get username and password from request body

    // Find user by username using Sequelize model
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).send("Invalid username or password"); // Unauthorized
    }

    // Verify password using bcrypt.compare (assuming hashed password in user.password)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid username or password"); // Unauthorized
    }

    // Login successful, generate a JWT token (we'll cover JWT in the next step)
    const token = generateJwtToken(user.id); // Replace with JWT generation logic

    res.json({ token }); // Send the generated token in the response
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error"); // Handle errors gracefully
  }
});

// Implement JWT generation function (replace with your logic)
function generateJwtToken(userId) {
  // ... JWT generation logic using jsonwebtoken library (refer to previous steps)
}

module.exports = router; // Export the router for use in app.js
