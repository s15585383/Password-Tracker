const router = require("express").Router();
const userRoutes = require("./userRoutes"); // Assuming this is for user routes
const passwordRoutes = require("./passwordsRoutes"); // Assuming this is for Password routes (not passwords)

// Mount user routes under the "/users" path
router.use("/users", userRoutes);

router.use("/Password", passwordRoutes);

module.exports = router;
