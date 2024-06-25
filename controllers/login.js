const express = require("express");
const router = express.Router(); // Use a separate router for login
const bcrypt = require("bcrypt"); // For password hashing
const User = require("../models/User");
const jwt = require("jsonwebtoken"); // For JWT generation
const validator = require("validator");

// ... other imports and setup (if needed)

async function registerUser(userInput, generateJwtToken) {
  // Basic validation using validator library (optional, replace with your logic)
  const errors = [];
  if (!validator.isLength(userInput.username, { min: 3, max: 20 })) {
    errors.push("Username must be between 3 and 20 characters");
  }
  if (!validator.isEmail(userInput.email)) {
    errors.push("Invalid email format");
  }
  if (!validator.isLength(userInput.password, { min: 8 })) {
    errors.push("Password must be at least 8 characters long");
  }

  // Check for existing user with username or email (unchanged)
  const existingUser = await User.findOne({
    where: { username: userInput.username }, // Check for username conflict
  });
  if (existingUser) {
    errors.push("Username already exists");
  }

  if (userInput.email) {
    // Check for email conflict if storing email (unchanged)
    const existingEmail = await User.findOne({
      where: { email: userInput.email },
    });
    if (existingEmail) {
      errors.push("Email already exists");
    }
  }

  // Return errors if any
  if (errors.length > 0) {
    return { errors };
  }

  // Hash password before saving (unchanged)
  const hashedPassword = await bcrypt.hash(userInput.password, 10);

  // Create a new user with hashed password and email (unchanged)
  const user = await User.create({
    username: userInput.username,
    email: userInput.email,
    password: hashedPassword,
  });

  // Generate JWT token
  const token = await generateJwtToken(user.id);

  return { user, token }; // Return user object and token
}

router.post("/register", async (req, res) => {
  try {
    const { error, user, token } = await registerUser(
      req.body,
      generateJwtToken
    );
    if (error) {
      return res.status(400).json({ message: error });
    }

    res.json({ message: "Registration successful", token, userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Implement JWT generation function (replace with actual logic)
function generateJwtToken(userId) {
  const secret = process.env.JWT_SECRET; // Access the secret key from environment variable

  const payload = { userId }; // Payload containing the user ID
  const options = {
    expiresIn: "30m", // Set expiration time for the token (30 minutes)
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;
