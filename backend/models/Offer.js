const mongoose = require('mongoose');

// One Offer = one negotiation between one buyer and one seller about one book.
// Every step of the negotiation is saved inside the "history" array.
const historySchema = new mongoose.Schema(
  {
    by: { type: String, enum: ['buyer', 'seller'], required: true },
    action: { type: String, enum: ['offer', 'counter', 'accept', 'reject', 'cancel'], required: true },
    amount: { type: Number }, // only used for "offer" and "counter"
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const offerSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    currentAmount: { type: Number, required: true }, // the latest price on the table
    lastActor: { type: String, enum: ['buyer', 'seller'], required: true }, // who made the latest offer

    // pending   = negotiation in progress
    // agreed    = both accepted the price (contact details are revealed to the buyer)
    // completed = seller marked the sale as completed
    // rejected  = one side rejected the price
    // cancelled = one side cancelled
    // closed    = the book was sold to somebody else or the listing was deleted
    status: {
      type: String,
      enum: ['pending', 'agreed', 'completed', 'rejected', 'cancelled', 'closed'],
      default: 'pending',
    },
    agreedPrice: { type: Number, default: null },
    history: [historySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Offer', offerSchema);
