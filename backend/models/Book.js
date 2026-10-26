const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 1 }, // asking price in rupees
    description: { type: String, default: '', trim: true },
    condition: {
      type: String,
      enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
      default: 'Good',
    },
    image: { type: String, required: true }, // file name saved inside backend/uploads
    status: { type: String, enum: ['available', 'sold'], default: 'available' },

    // Filled in only when the book is sold
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    soldPrice: { type: Number, default: null },
    soldAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
