const express = require("express"); // Import Express framework for building the server
const { User, Password } = require("./models/User"); // Import User and Password models for database interaction
const loginRouter = require("./controllers/api/login"); // Import login controller for handling login requests
// const cors = require('cors'); // Import CORS middleware (commented out for now)
const jwt = require("jsonwebtoken"); // Import JWT library for token generation and verification
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing

// Create an Express application instance
const app = express();

// Define the port to listen on (use environment variable or default to 3000)
const port = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static("public"));

// Serve static files from the "controllers" directory (not typical usage, for illustration purposes)
app.use(express.static("controllers"));

// Enable CORS if needed for cross-origin requests (commented out for now, adjust origins as needed)
// app.use(cors({ origin: 'http://localhost:3001' }));

// Parse incoming JSON data in request body
app.use(express.json());

// Use the imported login controller for requests under the "/auth" path
app.use("/auth", loginRouter);

// Function to verify a JWT token included in the request authorization header
function verifyJwtToken(req, res, next) {
  // Check if the authorization header exists and has the correct format ("Bearer token")
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized: Access denied");
  }

  const token = authHeader.split(" ")[1]; // Extract the token string from the header

  // Verify the token using the JWT library and the secret key from the environment variable
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send("Unauthorized: Invalid token");
    }

    // If the token is valid, attach the decoded user data to the request object for access in routes
    req.user = decoded;
    next(); // Proceed with the request handler if the token is valid
  });
}

// Function to authorize a user based on the password ID in the request parameter and the logged-in user's ID
const authorizeUser = async (req, res, next) => {
  try {
    const passwordId = req.params.id; // Extract the password ID from the request parameters
    const userId = req.user.id; // Get the logged-in user's ID from the request object

    // Find the password entry with the specified ID and check if it belongs to the logged-in user
    const password = await Password.findByPk(passwordId, {
      include: [
        {
          model: User,
          where: { id: userId }, // Filter by the logged-in user's ID
        },
      ],
    });

    if (!password) {
      return res.status(401).send("Unauthorized: Access denied");
    }

    next(); // Continue to the route handler if authorized
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// **--- User Registration Route ---**
// Handles user registration with username and password hashing

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body; // Extract username and password from the request body

    // Hash the password using bcrypt for secure storage
    const hashedPassword = await bcrypt.hash(password, 10); // Adjust salt rounds as needed

    // Create a new user record in the database
    const user = await User.create({ username, passwordHash: hashedPassword });

    // Generate a JWT token upon successful registration (implementation detail)
    // ... (code for JWT token generation omitted)

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// **--- User Login Route ---**
// Handles user login with username and password verification
// LOGIN SERVER SIDE
app.get("/login", (req, res) => {
  res.sendFile("login.html", { root: "public" });
});

// Protected routes
app.get("/passwords", authorizeUser, async (req, res) => {
  try {
    console.log("");

    const userId = req.user.id;

    const passwords = await Password.findAll({ where: { userId } });

    res.json(passwords);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/passwords/:id", authorizeUser, async (req, res) => {
  try {
    const passwordId = req.params.id;

    const password = await Password.findByPk(passwordId); // Fetch specific entry

    if (!password) {
      return res.status(404).send("Password not found"); // Handle non-existent entry
    }

    res.json(password);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/register", async (req, res) => {
  const { username, masterPassword } = req.body;
  try {
    const newUser = await User.create({ username, masterPassword }); // Hash password before storing
    res.json({ message: "User created successfully!", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// Login route handler
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ where: { username } });

    // Check if user exists and validate password
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res
        .status(401)
        .json({ message: "Login failed: Incorrect username or password" });
    }

    // Generate JWT token on successful login
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    }); // Adjust expiration time as needed

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Protected route for creating a password (POST)
app.post("/passwords", async (req, res) => {
  try {
    const { title, username, password } = req.body;
    const userId = req.user.id; // Assuming user ID is stored in req.user

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const newPassword = await Password.create({
      title,
      username,
      password: hashedPassword,
      userId,
    });

    res
      .status(201)
      .json({ message: "Password created successfully", newPassword });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Protected route for updating a password (PUT)
app.put("/passwords/:id", authorizeUser, async (req, res) => {
  try {
    const passwordId = req.params.id;
    const { title, username, password } = req.body;

    const existingPassword = await Password.findByPk(passwordId);

    if (!existingPassword) {
      return res.status(404).send("Password not found");
    }

    const updatedData = {}; // Object to store updated fields

    if (title) updatedData.title = title;
    if (username) updatedData.username = username;
    if (password) updatedData.password = await bcrypt.hash(password, 10);

    await existingPassword.update(updatedData);

    const updatedPassword = await Password.findByPk(passwordId); // Fetch updated entry

    res.json({ message: "Password updated successfully", updatedPassword });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Protected route for deleting a password (DELETE)
app.delete("/passwords/:id", verifyJwtToken, async (req, res) => {
  try {
    // Extract password ID from route parameter
    const passwordId = req.params.id;

    // Find the password to delete
    const password = await Password.findByPk(passwordId);

    // Check if password exists
    if (!password) {
      return res.status(404).send("Password not found");
    }

    // Verify user authorization (password belongs to the user)
    if (password.userId !== req.user.id) {
      return res
        .status(401)
        .send("Unauthorized: You cannot delete this password");
    }

    // Delete the password entry
    await password.destroy();

    // Send success message
    res.json({ message: "Password deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// ... other routes
//
// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });

async function getPasswordsByUserId(userId) {
  try {
    // find passwords associated with the user ID
    const passwords = await Password.findAll({
      where: { userId }, // Find passwords where userId matches
    });
    return passwords; // Return the retrieved passwords
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error for handling in the route
  }
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
