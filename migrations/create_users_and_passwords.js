const { Sequelize } = require("sequelize");

/**
 * This function creates the 'users' and 'passwords' tables in a Sequelize database.
 *
 * @param {Sequelize} sequelize The Sequelize instance connected to the database.
 *
 * @throws {Error} Throws an error if table creation fails.
 */
module.exports = async (sequelize) => {
  try {
    // Create the 'users' table
    await sequelize.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE, -- Enforces no duplicate usernames
        email VARCHAR(255) UNIQUE, -- Enforces no duplicate emails
        passwordHash VARCHAR(255) NOT NULL -- **Security:** Store hashed passwords, not plain text
      );
    `);

    // Create the 'passwords' table with foreign key referencing 'users'
    await sequelize.query(`
      CREATE TABLE passwords (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL, -- Foreign key to users.id
        title VARCHAR(255) NOT NULL,
        url VARCHAR(255),
        username VARCHAR(255),
        password VARCHAR(255) NOT NULL -- **Security:** Store hashed passwords, not plain text
      );
    `);

    console.log("Tables 'users' and 'passwords' created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error; // Re-throw the error for handling in the main application
  }
};
