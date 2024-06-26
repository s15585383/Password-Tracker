const router = require("express").Router();
const userRoutes = require("./userRoutes"); // Assuming this is for user routes
const projectRoutes = require("./projectRoutes"); // Assuming this is for project routes (not passwords)

// Mount user routes under the "/users" path
router.use("/users", userRoutes);

// Mount project routes under the "/projects" path (more descriptive)
router.use("/projects", projectRoutes);

module.exports = router;
