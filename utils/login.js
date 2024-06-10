const prompt = require('prompt'); // Install prompt module (npm install prompt)
const User = require('../models/User'); // Assuming your user model is in models/User.js

async function login() {
  // ... existing login logic (username, password) ...

  const user = await User.findOne({ where: { username } }); // Find user by username
  if (!user) {
    console.error('Invalid username or password.');
    return false;
  }

  const hashedMasterPassword = user.hashedMasterPassword; // Retrieve hashed password

  const isMatch = await bcrypt.compare(masterPassword, hashedMasterPassword);
  if (isMatch) {
    console.log('Master password verified! You can now view passwords.');
    return true; // Indicate successful login
  } else {
    console.error('Incorrect master password.');
    return false;
  }
}

module.exports = login;
