const router = require("express").Router(); // Create an Express router
const { User } = require("../../models"); // Import the User model

// Route to create a new user (signup)
router.post("/", async (req, res) => {
  try {
    // Create a new user using data from the request body
    const userData = await User.create(req.body);

    // After successful creation, save the session
    req.session.save(() => {
      // Set session variables for user ID and logged-in status
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      // Send success response with the created user data (status code 200)
      res.status(200).json(userData);
    });
  } catch (err) {
    // Handle errors by sending a bad request response with the error details (status code 400)
    res.status(400).json(err);
  }
});

// Route to handle user login
router.post("/login", async (req, res) => {
  try {
    // Find a user with the provided email address
    const userData = await User.findOne({ where: { email: req.body.email } });

    // Check if a user was found
    if (!userData) {
      // Send a bad request response with a generic error message (security best practice)
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return; // Exit the function after sending the response
    }

    // Check if the provided password matches the user's hashed password
    const validPassword = await userData.checkPassword(req.body.password);

    // Check if the password is valid
    if (!validPassword) {
      // Send a bad request response with a generic error message (security best practice)
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return; // Exit the function after sending the response
    }

    // Login successful, save the session
    req.session.save(() => {
      // Set session variables for user ID and logged-in status
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      // Send success response with user data and a login message (status code 200)
      res.json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    // Handle errors by sending a bad request response with the error details (status code 400)
    res.status(400).json(err);
  }
});

// Route to handle user logout
router.post("/logout", (req, res) => {
  // Check if the user is currently logged in
  if (req.session.logged_in) {
    // Destroy the session to log the user out
    req.session.destroy(() => {
      // Send a success response with no content (status code 204)
      res.status(204).end();
    });
  } else {
    // User is not logged in, send a not found response (status code 404)
    res.status(404).end();
  }
});

module.exports = router; // Export the router for use in the main application
