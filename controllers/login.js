const express = require("express");
const router = express.Router(); // Use a separate router for login
const bcrypt = require("bcryptjs"); // For password hashing
const User = require("../models/User");
const jwt = require("jsonwebtoken"); // For JWT generation

// ... other imports and setup (if needed)
router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/profile");
    return;
  }

  res.render("login");
});

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
