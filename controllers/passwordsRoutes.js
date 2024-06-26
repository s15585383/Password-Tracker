const router = require("express").Router(); // Create an Express router
const { Project } = require("../../models"); // Import the Project model
const withAuth = require("../../utils/auth"); // Import the withAuth middleware

// Protected route to create a new project (requires authentication)
router.post("/", withAuth, async (req, res) => {
  try {
    // Create a new project using data from the request body
    const newProject = await Project.create({
      ...req.body, // Spread operator to include all data from the request body
      user_id: req.session.user_id, // Add the currently logged-in user's ID
    });

    // Send a success response with the newly created project data (status code 200)
    res.status(200).json(newProject);
  } catch (err) {
    // Handle errors by sending a bad request response with the error details (status code 400)
    res.status(400).json(err);
  }
});

// Protected route to delete a project (requires authentication)
router.delete("/:id", withAuth, async (req, res) => {
  try {
    // Attempt to delete the project with the specified ID
    const projectData = await Project.destroy({
      where: {
        id: req.params.id, // Match the project ID from URL parameter
        user_id: req.session.user_id, // Ensure only the logged-in user can delete their projects
      },
    });

    // Check if a project was actually deleted
    if (!projectData) {
      // If no project found, send a not found response (status code 404)
      res.status(404).json({ message: "No project found with this id!" });
      return; // Exit the function after sending the response
    }

    // Send a success response with the number of deleted projects (status code 200)
    // (In this case, it should always be 1 if the deletion was successful)
    res.status(200).json(projectData);
  } catch (err) {
    // Handle errors by sending a server error response with the error details (status code 500)
    res.status(500).json(err);
  }
});

module.exports = router; // Export the router for use in the main application
