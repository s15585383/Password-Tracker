const Sequelize = require("sequelize"); // Import the Sequelize library
require("dotenv").config(); // Load environment variables from a .env file

let sequelize; // Declare a variable to hold the Sequelize instance

// Check if a database connection URL is defined in the environment variables
if (process.env.DB_URL) {
  sequelize = new Sequelize(process.env.DB_URL); // Use the provided URL for connection
} else {
  // If no URL is provided, use individual credentials
  sequelize = new Sequelize(
    process.env.DB_NAME, // Database name from environment variable
    process.env.DB_USER, // Database user from environment variable
    process.env.DB_PASSWORD, // Database password from environment variable
    {
      host: "localhost", // Database host (localhost in this case)
      dialect: "postgres", // Database dialect (Postgres in this case)
      port: "5433", // Database port (default for Postgres)
    }
  );

  // Test the connection to the database (optional but recommended)

  // sequelize.authenticate();
  // (error) {
  //   console.error("Error connecting to database:", error);
  //   process.exit(1); // Exit the process with an error code if connection fails
  // }
}

// Export the sequelize instance for use in other parts of the application
module.exports = sequelize;
