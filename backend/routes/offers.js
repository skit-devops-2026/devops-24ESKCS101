const express = require('express');
const mongoose = require('mongoose');
const Book = require('../models/Book');
const Offer = require('../models/Offer');
const User = require('../models/User');
const protect = require('../middleware/auth');

const router = express.Router();

// All routes in this file need the user to be logged in
router.use(protect);

// ---------- helper functions ----------

// Loads an offer together with the book and the two users
const populateOffer = (query) =>
  query
    .populate('book', 'title author image price status')
    .populate('buyer', 'username')
    .populate('seller', 'username email phone salesCount');

// Prepares an offer for the browser:
//  - tells the browser if the logged-in user is the buyer or the seller
//  - tells the browser whose turn it is to respond
//  - HIDES the seller's email and phone unless the price is agreed and the viewer is the buyer
const toClient = (offer, userId) => {
  const o = offer.toObject();
  const role = String(o.buyer._id) === String(userId) ? 'buyer' : 'seller';
  o.role = role;
  o.myTurn = o.status === 'pending' && o.lastActor !== role;

  const showContact = role === 'buyer' && (o.status === 'agreed' || o.status === 'completed');
  if (!showContact) {
    delete o.seller.email;
    delete o.seller.phone;
  }
  return o;
};

const isParticipant = (offer, userId) =>
  String(offer.buyer) === String(userId) || String(offer.seller) === String(userId);

const roleOf = (offer, userId) => (String(offer.buyer) === String(userId) ? 'buyer' : 'seller');

const validAmount = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n >= 1 ? Math.round(n) : null;
};

// ---------- routes ----------
// NOTE: fixed paths (/incoming, /mine, /for-book/...) are placed before /:id

// POST /api/offers  { bookId, amount }  -> buyer starts a negotiation
router.post('/', async (req, res) => {
  try {
    const { bookId } = req.body;
    const amount = validAmount(req.body.amount);

    if (!mongoose.isValidObjectId(bookId)) return res.status(400).json({ message: 'Invalid book.' });
    if (!amount) return res.status(400).json({ message: 'Please enter a valid offer amount.' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found.' });
    if (book.status !== 'available') return res.status(400).json({ message: 'Sorry, this book has already been sold.' });
    if (String(book.seller) === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot make an offer on your own book.' });
    }

    const existing = await Offer.findOne({
      book: book._id,
      buyer: req.user._id,
      status: { $in: ['pending', 'agreed'] },
    });
    if (existing) {
      return res.status(400).json({
        message: 'You already have an active negotiation for this book.',
        offerId: existing._id,
      });
    }

    const offer = await Offer.create({
      book: book._id,
      buyer: req.user._id,
      seller: book.seller,
      currentAmount: amount,
      lastActor: 'buyer',
      history: [{ by: 'buyer', action: 'offer', amount }],
    });
    res.status(201).json({ offerId: offer._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/offers/incoming -> offers other people made on MY books
router.get('/incoming', async (req, res) => {
  try {
    const offers = await populateOffer(Offer.find({ seller: req.user._id }).sort({ updatedAt: -1 }));
    res.json(offers.map((o) => toClient(o, req.user._id)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/offers/mine -> offers I made on other people's books
router.get('/mine', async (req, res) => {
  try {
    const offers = await populateOffer(Offer.find({ buyer: req.user._id }).sort({ updatedAt: -1 }));
    res.json(offers.map((o) => toClient(o, req.user._id)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/offers/for-book/:bookId -> my active negotiation for one book (or null)
router.get('/for-book/:bookId', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.bookId)) return res.json(null);
    const offer = await Offer.findOne({
      book: req.params.bookId,
      buyer: req.user._id,
      status: { $in: ['pending', 'agreed'] },
    });
    res.json(offer ? { offerId: offer._id, status: offer.status } : null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/offers/:id -> one negotiation (only the buyer and the seller can see it)
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Negotiation not found.' });
    const offer = await populateOffer(Offer.findById(req.params.id));
    if (!offer) return res.status(404).json({ message: 'Negotiation not found.' });
    // (buyer and seller are populated here, so compare their _id values)
    const me = String(req.user._id);
    if (String(offer.buyer._id) !== me && String(offer.seller._id) !== me) {
      return res.status(403).json({ message: 'This negotiation is private.' });
    }
    res.json(toClient(offer, req.user._id));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/offers/:id/respond  { action: 'accept' | 'reject' | 'counter', amount }
// The person who did NOT make the latest offer can respond.
router.post('/:id/respond', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Negotiation not found.' });
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Negotiation not found.' });
    if (!isParticipant(offer, req.user._id)) return res.status(403).json({ message: 'This negotiation is private.' });
    if (offer.status !== 'pending') return res.status(400).json({ message: 'This negotiation is already finished.' });

    // The book must still be available
    const book = await Book.findById(offer.book);
    if (!book || book.status !== 'available') {
      offer.status = 'closed';
      await offer.save();
      return res.status(400).json({ message: 'This book has already been sold.' });
    }

    const role = roleOf(offer, req.user._id);
    if (offer.lastActor === role) {
      return res.status(400).json({ message: 'Please wait for the other person to respond.' });
    }

    const { action } = req.body;
    if (action === 'accept') {
      offer.status = 'agreed';
      offer.agreedPrice = offer.currentAmount;
      offer.history.push({ by: role, action: 'accept', amount: offer.currentAmount });
    } else if (action === 'reject') {
      offer.status = 'rejected';
      offer.history.push({ by: role, action: 'reject', amount: offer.currentAmount });
    } else if (action === 'counter') {
      const amount = validAmount(req.body.amount);
      if (!amount) return res.status(400).json({ message: 'Please enter a valid counteroffer amount.' });
      if (amount === offer.currentAmount) {
        return res.status(400).json({ message: 'That is the same price. Use Accept instead.' });
      }
      offer.currentAmount = amount;
      offer.lastActor = role;
      offer.history.push({ by: role, action: 'counter', amount });
    } else {
      return res.status(400).json({ message: 'Action must be accept, reject or counter.' });
    }

    await offer.save();
    res.json({ message: 'Done.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/offers/:id/cancel -> buyer or seller cancels a pending/agreed negotiation
router.post('/:id/cancel', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Negotiation not found.' });
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Negotiation not found.' });
    if (!isParticipant(offer, req.user._id)) return res.status(403).json({ message: 'This negotiation is private.' });
    if (offer.status !== 'pending' && offer.status !== 'agreed') {
      return res.status(400).json({ message: 'This negotiation is already finished.' });
    }

    offer.status = 'cancelled';
    offer.history.push({ by: roleOf(offer, req.user._id), action: 'cancel' });
    await offer.save();
    res.json({ message: 'Negotiation cancelled.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/offers/:id/complete -> seller marks the sale as completed
router.post('/:id/complete', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Negotiation not found.' });
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Negotiation not found.' });
    if (String(offer.seller) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Only the seller can mark a sale as completed.' });
    }
    if (offer.status !== 'agreed') {
      return res.status(400).json({ message: 'Both sides must agree on the price first.' });
    }

    // Mark the book as sold ONLY if it is still available.
    // Doing it in one database command stops two buyers from buying the same book.
    const book = await Book.findOneAndUpdate(
      { _id: offer.book, status: 'available' },
      { status: 'sold', buyer: offer.buyer, soldPrice: offer.agreedPrice, soldAt: new Date() },
      { new: true }
    );
    if (!book) {
      offer.status = 'closed';
      await offer.save();
      return res.status(400).json({ message: 'This book has already been sold.' });
    }

    offer.status = 'completed';
    await offer.save();

    // Automatically increase the seller's completed sales count
    await User.findByIdAndUpdate(offer.seller, { $inc: { salesCount: 1 } });

    // Close every other open negotiation for this book
    await Offer.updateMany(
      { book: offer.book, _id: { $ne: offer._id }, status: { $in: ['pending', 'agreed'] } },
      { status: 'closed' }
    );

    res.json({ message: 'Sale completed.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
