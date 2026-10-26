const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config({ quiet: true });

const connectDB = require('./config/db');

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('Missing MONGO_URI or JWT_SECRET. Create backend/.env by copying backend/.env.example');
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json()); // lets us read JSON sent by React

// Make uploaded book pictures available at http://localhost:5001/uploads/<file name>
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/offers', require('./routes/offers'));

// Unknown API path
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API route not found.' });
});

// Last-resort error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
});
