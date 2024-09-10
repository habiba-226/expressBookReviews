const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
let books = require('./booksdb'); // Import the books database
const regd_users = express.Router();

let users = [
  { username: 'exampleUser', password: 'examplePassword' }
];

const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Check if username and password match the records
const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username);
  return user ? user.password === password : false;
};

// Middleware to extract token and attach user info
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Only registered users can login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// Add or Modify Review
regd_users.put("/review/:isbn", (req, res) => {
  const { username } = req.user; // Assuming user is authenticated and username is available
  const { isbn } = req.params;
  const { review } = req.body;

  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Update or add review
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully" });
});

// Delete a book review
regd_users.delete('/auth/review/:isbn', authenticateToken, (req, res) => {
  const { isbn } = req.params;
  const { username } = req.user;

  const book = books[isbn];
  if (book) {
    const reviewIndex = book.reviews.findIndex(r => r.username === username);
    if (reviewIndex !== -1) {
      book.reviews.splice(reviewIndex, 1); // Remove the review
      res.status(200).json({ message: "Review deleted", book });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports = regd_users;
