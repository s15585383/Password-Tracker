const bcrypt = require("bcrypt"); // For password hashing
const User = require("../models/User"); // Import the User model
const jwt = require("jsonwebtoken"); // For JWT generation
const validator = require("validator"); // For basic validation
const errorMessageEl = document.getElementById("error-message"); // DOM element for displaying error messages

const registerForm = document.querySelector("#register-form"); // Select the register form element

// Function to register a new user
async function registerUser(userInput, generateJwtToken) {
  // Initialize an empty errors array
  const errors = [];

  // Basic validation using validator library (optional, replace with your logic)
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
    where: { username: userInput.username }, // Check for username conflicts in the database
  });
  if (existingUser) {
    errors.push("Username already exists");
  }

  if (userInput.email) {
    // Check for email conflict if storing email (unchanged)
    const existingEmail = await User.findOne({
      where: { email: userInput.email }, // Check for email conflicts in the database
    });
    if (existingEmail) {
      errors.push("Email already exists");
    }
  }

  // Return errors if any validation or conflict checks fail
  if (errors.length > 0) {
    return { errors };
  }

  // Hash the user's password before saving (unchanged)
  const hashedPassword = await bcrypt.hash(userInput.password, 10);

  // Create a new user with hashed password and email (unchanged)
  const user = await User.create({
    username: userInput.username,
    email: userInput.email,
    password: hashedPassword,
  });

  // Generate a JWT token using the user's ID (implementation assumed in generateJwtToken function)
  const token = await generateJwtToken(user.id);

  // Return the created user object and the generated JWT token
  return { user, token };
}

// Event listener for form submission
registerForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent default form submission behavior

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Send a POST request to the "/register" endpoint with user data
  const response = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  // Handle the response from the server
  if (!response.ok) {
    const errorData = await response.json();
    errorMessageEl.textContent = errorData.message || "Registration failed"; // Display specific error message if provided, or a generic message
  } else {
    // Handle successful registration (e.g., redirect to login page or display success message)
    console.log("Registration successful!");
  }
});
