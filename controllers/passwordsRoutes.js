const router = require("express").Router(); // Create an Express router
const { Password } = require("../../models");
const withAuth = require("../../utils/auth"); // Import the withAuth middleware

// Protected route to create a new Password
router.post("/", withAuth, async (req, res) => {
  try {
    const newPassword = await Password.create({
      ...req.body, // Spread operator to include all data from the request body
      user_id: req.session.user_id, // Add the currently logged-in user's ID
    });

    // Send a success response with the newly created data (status code 200)
    res.status(200).json(newPassword);
  } catch (err) {
    // Handle errors by sending a bad request response with the error details (status code 400)
    res.status(400).json(err);
  }
});

// Protected route to delete
router.delete("/:id", withAuth, async (req, res) => {
  try {
    // Attempt to delete the password with the specified ID
    const passwordData = await Password.destroy({
      where: {
        id: req.params.id, // Match the ID from URL parameter
        user_id: req.session.user_id, // Ensure only the logged-in user can delete their passwords
      },
    });

    // Check if a password was actually deleted
    if (!passwordData) {
      // If not found, send a not found response (status code 404)
      res.status(404).json({ message: "No Password found with this id!" });
      return; // Exit the function after sending the response
    }

    // Send a success response with the number of deleted passwords (status code 200)
    // (In this case, it should always be 1 if the deletion was successful)
    res.status(200).json(passwordData);
  } catch (err) {
    // Handle errors by sending a server error response with the error details (status code 500)
    res.status(500).json(err);
  }
});

module.exports = router; // Export the router for use in the main application
