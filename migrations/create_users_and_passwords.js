const { Sequelize } = require("sequelize");

module.exports = async (sequelize) => {
  await sequelize.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE, -- Assuming username is unique
      email VARCHAR(255) UNIQUE, -- Add email with UNIQUE constraint
      passwordHash VARCHAR(255) NOT NULL
    );
  `);

  await sequelize.query(`
    CREATE TABLE passwords (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) NOT NULL,
      title VARCHAR(255) NOT NULL,
      url VARCHAR(255),
      username VARCHAR(255),
      password VARCHAR(255) NOT NULL
    );
  `);
};
