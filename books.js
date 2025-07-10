const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const auth = require('../middleware/auth');

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a book (admin only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  const { title, author, isbn, genre } = req.body;
  try {
    const book = new Book({ title, author, isbn, genre });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a book (admin only)
router.delete('/:isbn', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  try {
    await Book.findOneAndDelete({ isbn: req.params.isbn });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Borrow a book
router.post('/borrow/:isbn', auth, async (req, res) => {
  try {
    const book = await Book.findOne({ isbn: req.params.isbn });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.status === 'borrowed') return res.status(400).json({ message: 'Book already borrowed' });

    book.status = 'borrowed';
    await book.save();
    res.json({ message: 'Book borrowed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;