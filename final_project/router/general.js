const express = require('express');
const axios = require('axios');
const router = express.Router();

// Base URL for your API
const API_BASE_URL = 'http://localhost:5000';

// Task 10: Get list of books
router.get('/books', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/books`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).send('Server Error');
  }
});

// Task 11: Get book details by ISBN
router.get('/books/:isbn', async (req, res) => {
  const { isbn } = req.params;
  try {
    const response = await axios.get(`${API_BASE_URL}/books/${isbn}`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching book with ISBN ${isbn}:`, error);
    res.status(500).send('Server Error');
  }
});

router.get('/books/author/:author', async (req, res) => {
  const { author } = req.params;
  try {
    const response = await axios.get(`${API_BASE_URL}/books/author/${encodeURIComponent(author)}`);
    if (response.status === 200) {
      res.json(response.data);
    } else {
      res.status(response.status).send(`Error: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error fetching books by author ${author}:`, error.message);
    res.status(500).send(`Server Error: ${error.message}`);
  }
});


// Task 13: Get book details by Title
router.get('/books/title/:title', async (req, res) => {
  const { title } = req.params;
  try {
    const response = await axios.get(`${API_BASE_URL}/books/title/${title}`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching books with title ${title}:`, error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
