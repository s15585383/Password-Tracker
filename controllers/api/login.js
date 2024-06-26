const express = require("express");
const router = express.Router(); // Use a separate router for login

const bcrypt = require("bcrypt"); // For password hashing
const User = require("../../models/Users");
const jwt = require("jsonwebtoken"); // For JWT generation

// ... other imports and setup (if needed)

// Route to render the login page
router.get("/login", (req, res) => {
  // If the user is already logged in, redirect to profile
  if (req.session.logged_in) {
    res.redirect("/profile");
    return;
  }

  res.render("login");
});

// Route to handle user registration with JWT
router.post("/register", async (req, res) => {
  try {
    // Validate user data (implement proper validation logic here)
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with hashed password
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate a JWT using a secure secret key from environment variable
    const token = generateJwtToken(user.id);

    res.json({ message: "Registration successful", token, userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Implement JWT generation function (replace with actual logic)
function generateJwtToken(userId) {
  const secret = process.env.JWT_SECRET; // Access the secret key from environment variable

  // Ensure a strong and unique secret key is set in the environment
  // **Security Consideration:** Never store the secret key directly in your code.

  const payload = { userId }; // Payload containing the user ID
  const options = {
    expiresIn: "30m", // Set expiration time for the token (30 minutes)
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;
