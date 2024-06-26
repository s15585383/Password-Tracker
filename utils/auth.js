/**
 * This middleware function checks for user authentication before continuing with the request.
 *
 * @param {Object} req - The Express.js request object
 * @param {Object} res - The Express.js response object
 * @param {Function} next - The next middleware function in the chain
 */
const withAuth = (req, res, next) => {
  // Check if the user has a logged_in property set in the session object
  if (!req.session.logged_in) {
    // User is not logged in, redirect to the login route
    console.log("User is not authenticated, redirecting to login...");
    res.redirect("/login");
  } else {
    // User is logged in, proceed with the next middleware or route handler
    console.log("User is authenticated, continuing with the request...");
    next();
  }
};

// Export the withAuth middleware function to be used in other parts of the application
module.exports = withAuth;
