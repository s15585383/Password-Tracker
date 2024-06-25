const Sequelize = require("sequelize");
require("dotenv").config();

let sequelize;

if (process.env.DB_URL) {
  sequelize = new Sequelize(process.env.DB_URL);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: "localhost",
      dialect: "postgres",
      port: "5433",
    }
  );
  // Test the connection (optional)
  try {
    await sequelize.authenticate();
    console.log("Connection to database established successfully.");
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1); // Exit the process on error
  }

  return sequelize;
}

module.exports = sequelize;
