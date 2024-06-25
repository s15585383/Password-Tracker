const bcrypt = require("bcryptjs"); // For password hashing
const User = require("../models/User");
const jwt = require("jsonwebtoken"); // For JWT generation
const validator = require("validator");
const errorMessageEl = document.getElementById("error-message");

const registerForm = document.querySelector("#register-form");

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
registerForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent default form submission

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    errorMessageEl.textContent = errorData.message || "Registration failed"; // Display error message or generic message
  } else {
    // Handle successful registration
    console.log("Registration successful!");
    // redirect the user to the login page or display a success message
  }
});
