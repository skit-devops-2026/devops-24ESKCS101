const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Book = require('../models/Book');
const Offer = require('../models/Offer');
const protect = require('../middleware/auth');
const { upload, uploadFolder } = require('../middleware/upload');

const router = express.Router();

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

// ---------- small helper functions ----------

// Runs multer for a single file field called "image" and returns a JSON error if it fails
const handleUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      const message = err.code === 'LIMIT_FILE_SIZE' ? 'Image must be smaller than 3 MB.' : err.message;
      return res.status(400).json({ message });
    }
    next();
  });
};

// Deletes an image file from the uploads folder (ignores errors if the file is missing)
const deleteImage = (filename) => {
  if (!filename) return;
  fs.unlink(path.join(uploadFolder, path.basename(filename)), () => {});
};

// Checks the text fields of the book form. Returns an error message or null.
const validateBook = (body) => {
  const { title, author, price, condition } = body;
  if (!title || !title.trim()) return 'Title is required.';
  if (!author || !author.trim()) return 'Author is required.';
  if (price === undefined || price === '' || isNaN(Number(price)) || Number(price) < 1) {
    return 'Please enter a valid asking price (at least 1).';
  }
  if (condition && !CONDITIONS.includes(condition)) return 'Invalid book condition.';
  return null;
};

// Makes user text safe to use inside a regular expression (for search)
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ---------- routes ----------
// NOTE: fixed paths like /mine must come BEFORE /:id, otherwise "mine" would be read as an id.

// GET /api/books?search=harry   -> all books that are still available
router.get('/', async (req, res) => {
  try {
    const filter = { status: 'available' };
    const search = (req.query.search || '').trim();
    if (search) {
      const regex = new RegExp(escapeRegex(search), 'i'); // 'i' = ignore upper/lower case
      filter.$or = [{ title: regex }, { author: regex }];
    }
    const books = await Book.find(filter)
      .populate('seller', 'username salesCount')
      .sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/books/mine -> my own listings (available and sold)
router.get('/mine', protect, async (req, res) => {
  try {
    const books = await Book.find({ seller: req.user._id })
      .populate('seller', 'username salesCount')
      .sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/books/my-sales -> books I have sold
router.get('/my-sales', protect, async (req, res) => {
  try {
    const books = await Book.find({ seller: req.user._id, status: 'sold' })
      .populate('buyer', 'username')
      .sort({ soldAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/books/my-purchases -> books I have bought
router.get('/my-purchases', protect, async (req, res) => {
  try {
    const books = await Book.find({ buyer: req.user._id })
      .populate('seller', 'username')
      .sort({ soldAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/books/:id -> one book
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Book not found.' });
    }
    const book = await Book.findById(req.params.id).populate('seller', 'username salesCount');
    if (!book) return res.status(404).json({ message: 'Book not found.' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/books -> create a listing (needs login + a picture)
router.post('/', protect, handleUpload, async (req, res) => {
  try {
    const problem = validateBook(req.body);
    if (problem) {
      if (req.file) deleteImage(req.file.filename);
      return res.status(400).json({ message: problem });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a picture of the book.' });
    }

    const book = await Book.create({
      seller: req.user._id,
      title: req.body.title,
      author: req.body.author,
      price: Number(req.body.price),
      description: req.body.description || '',
      condition: req.body.condition || 'Good',
      image: req.file.filename,
    });
    res.status(201).json(book);
  } catch (error) {
    if (req.file) deleteImage(req.file.filename);
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/books/:id -> edit my own listing (picture is optional here)
router.put('/:id', protect, handleUpload, async (req, res) => {
  try {
    const fail = (status, message) => {
      if (req.file) deleteImage(req.file.filename);
      return res.status(status).json({ message });
    };

    if (!mongoose.isValidObjectId(req.params.id)) return fail(404, 'Book not found.');
    const book = await Book.findById(req.params.id);
    if (!book) return fail(404, 'Book not found.');
    if (String(book.seller) !== String(req.user._id)) return fail(403, 'You can only edit your own listings.');
    if (book.status === 'sold') return fail(400, 'A sold book cannot be edited.');

    const problem = validateBook(req.body);
    if (problem) return fail(400, problem);

    book.title = req.body.title;
    book.author = req.body.author;
    book.price = Number(req.body.price);
    book.description = req.body.description || '';
    book.condition = req.body.condition || book.condition;

    if (req.file) {
      deleteImage(book.image); // remove the old picture
      book.image = req.file.filename;
    }

    await book.save();
    res.json(book);
  } catch (error) {
    if (req.file) deleteImage(req.file.filename);
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/books/:id -> delete my own listing
router.delete('/:id', protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Book not found.' });
    }
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found.' });
    if (String(book.seller) !== String(req.user._id)) {
      return res.status(403).json({ message: 'You can only delete your own listings.' });
    }
    if (book.status === 'sold') {
      return res.status(400).json({ message: 'A sold book stays in your sales history and cannot be deleted.' });
    }

    await Offer.deleteMany({ book: book._id }); // remove negotiations about this book
    deleteImage(book.image);
    await book.deleteOne();
    res.json({ message: 'Listing deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
