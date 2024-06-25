const router = require("express").Router();
const userRoutes = require("./userRoutes");
const projectRoutes = require("./passwordsRoutes");

router.use("/users", userRoutes);
router.use("/passwords", projectRoutes);

module.exports = router;
