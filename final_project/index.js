const express = require('express');
const bodyParser = require('body-parser');
const books = require('./router/booksdb'); // Import the books data
const regd_users = require('./router/auth_users'); // Import the registered users router
const generalRouter = require('./router/general'); // Import the general router

const app = express();
const PORT = 5000;

app.use(bodyParser.json()); // To parse JSON bodies

// Books routes
app.use('/api', generalRouter); // Use generalRouter for API routes

// Auth routes
app.use('/auth', regd_users); // Mount the auth router for user login and review management

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
