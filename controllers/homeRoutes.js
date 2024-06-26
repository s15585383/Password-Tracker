const router = require("express").Router(); // Create an Express router

// Import project and user models from the models directory
const { Password, User } = require("../models");

// Import the withAuth middleware function from the utils directory
const withAuth = require("../utils/auth");

// Route to display all projects on homepage
router.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Route to display a specific project by its ID
router.get("/project/:id", async (req, res) => {
  try {
    // Find project by ID and include associated user data (name)
    const projectData = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    // Convert project data to a plain object for template rendering
    const project = projectData.get({ plain: true });

    // Pass serialized project data and logged_in status to the project template
    res.render("project", {
      ...project,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    // Handle errors by sending a JSON response with status code 500
    res.status(500).json(err);
  }
});

// Protected route for user profile, uses withAuth middleware
router.get("/profile", withAuth, async (req, res) => {
  try {
    // Find the logged-in user based on the session user ID
    // Exclude the password attribute from the user data
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Project }],
    });

    // Convert user data to a plain object for template rendering
    const user = userData.get({ plain: true });

    // Pass serialized user data and set logged_in to true  for the profile template
    res.render("profile", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    // Handle errors by sending a JSON response with status code 500
    res.status(500).json(err);
  }
});

// Route to render the login page
router.get("/login", (req, res) => {
  // If user is already logged in, redirect to profile page
  if (req.session.logged_in) {
    res.redirect("/profile");
    return;
  }

  // Render the login template
  res.render("login");
});

module.exports = router; // Export the router for use in the main application
