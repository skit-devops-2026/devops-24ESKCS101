// Seed script: fills the database with dummy data so you can test the website immediately.
// Run it with:   npm run seed
// WARNING: it first DELETES all users, books and offers in the database named in MONGO_URI.

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ quiet: true });

const User = require('./models/User');
const Book = require('./models/Book');
const Offer = require('./models/Offer');

const uploadFolder = path.join(__dirname, 'uploads');
const PASSWORD = 'Password@123'; // every sample user uses this password

// ---------- sample users (all contact details are fictional) ----------
const usersData = [
  { username: 'asha_verma', email: 'asha@example.com', phone: '+91 90000 10001' },
  { username: 'rohan_mehta', email: 'rohan@example.com', phone: '+91 90000 10002' },
  { username: 'meera_nair', email: 'meera@example.com', phone: '+91 90000 10003' },
  { username: 'karan_singh', email: 'karan@example.com', phone: '+91 90000 10004' },
  { username: 'ishita_rao', email: 'ishita@example.com', phone: '+91 90000 10005' },
  { username: 'vikram_joshi', email: 'vikram@example.com', phone: '+91 90000 10006' },
];

// ---------- books that are still for sale (14) ----------
// key = short name used below when creating negotiations
const availableBooks = [
  { key: 'dsa', seller: 'asha_verma', title: 'Data Structures and Algorithms Made Easy', author: 'Narasimha Karumanchi', price: 350, condition: 'Good', description: 'Popular interview preparation book. A few pencil notes inside.' },
  { key: 'alchemist', seller: 'asha_verma', title: 'The Alchemist', author: 'Paulo Coelho', price: 120, condition: 'Like New', description: 'Read once. No marks or torn pages.' },
  { key: 'os', seller: 'asha_verma', title: 'Operating System Concepts', author: 'Abraham Silberschatz', price: 450, condition: 'Fair', description: 'The dinosaur book. Cover is worn but all pages are intact.' },
  { key: 'cleancode', seller: 'rohan_mehta', title: 'Clean Code', author: 'Robert C. Martin', price: 500, condition: 'Good', description: 'A must-read for every programmer. Highlighted in a few chapters.' },
  { key: 'wings', seller: 'rohan_mehta', title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', price: 150, condition: 'Good', description: 'An inspiring autobiography. Clean copy.' },
  { key: 'letusc', seller: 'rohan_mehta', title: 'Let Us C', author: 'Yashavant Kanetkar', price: 180, condition: 'Fair', description: 'Good for first-year C programming. Some pages are folded.' },
  { key: 'money', seller: 'meera_nair', title: 'The Psychology of Money', author: 'Morgan Housel', price: 250, condition: 'Like New', description: 'Bought last month, read only once.' },
  { key: 'dbms', seller: 'meera_nair', title: 'Database System Concepts', author: 'Abraham Silberschatz', price: 400, condition: 'Good', description: 'Useful for the DBMS course. No missing pages.' },
  { key: 'pride', seller: 'meera_nair', title: 'Pride and Prejudice', author: 'Jane Austen', price: 100, condition: 'Good', description: 'Classic paperback edition.' },
  { key: 'python', seller: 'karan_singh', title: 'Python Crash Course', author: 'Eric Matthes', price: 450, condition: 'New', description: 'Never used. Bought a duplicate by mistake.' },
  { key: 'habits', seller: 'karan_singh', title: 'Atomic Habits', author: 'James Clear', price: 280, condition: 'Like New', description: 'Barely read. Looks brand new.' },
  { key: 'networks', seller: 'ishita_rao', title: 'Computer Networks', author: 'Andrew S. Tanenbaum', price: 380, condition: 'Good', description: 'Fifth edition. Some underlining in chapter 3.' },
  { key: 'richdad', seller: 'ishita_rao', title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', price: 130, condition: 'Fair', description: 'Readable copy with a slightly faded cover.' },
  { key: 'mlpython', seller: 'vikram_joshi', title: 'Introduction to Machine Learning with Python', author: 'Andreas Muller and Sarah Guido', price: 550, condition: 'Like New', description: 'Great for beginners in ML. Very clean copy.' },
];

// ---------- books that are already sold (10 completed transactions) ----------
const soldBooks = [
  { seller: 'asha_verma', buyer: 'rohan_mehta', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', price: 600, soldPrice: 520, condition: 'Good', daysAgo: 60 },
  { seller: 'asha_verma', buyer: 'meera_nair', title: 'Higher Engineering Mathematics', author: 'B.S. Grewal', price: 300, soldPrice: 250, condition: 'Fair', daysAgo: 45 },
  { seller: 'asha_verma', buyer: 'karan_singh', title: 'Digital Logic and Computer Design', author: 'M. Morris Mano', price: 280, soldPrice: 240, condition: 'Good', daysAgo: 30 },
  { seller: 'asha_verma', buyer: 'ishita_rao', title: 'The Kite Runner', author: 'Khaled Hosseini', price: 150, soldPrice: 130, condition: 'Good', daysAgo: 12 },
  { seller: 'rohan_mehta', buyer: 'asha_verma', title: 'Discrete Mathematics and Its Applications', author: 'Kenneth H. Rosen', price: 450, soldPrice: 400, condition: 'Good', daysAgo: 50 },
  { seller: 'rohan_mehta', buyer: 'vikram_joshi', title: 'Think and Grow Rich', author: 'Napoleon Hill', price: 120, soldPrice: 100, condition: 'Fair', daysAgo: 25 },
  { seller: 'rohan_mehta', buyer: 'meera_nair', title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell and Peter Norvig', price: 650, soldPrice: 580, condition: 'Like New', daysAgo: 8 },
  { seller: 'meera_nair', buyer: 'karan_singh', title: 'The White Tiger', author: 'Aravind Adiga', price: 140, soldPrice: 120, condition: 'Good', daysAgo: 20 },
  { seller: 'vikram_joshi', buyer: 'asha_verma', title: 'Head First Java', author: 'Kathy Sierra and Bert Bates', price: 400, soldPrice: 350, condition: 'Good', daysAgo: 35 },
  { seller: 'vikram_joshi', buyer: 'ishita_rao', title: 'Hands-On Machine Learning', author: 'Aurelien Geron', price: 700, soldPrice: 640, condition: 'Like New', daysAgo: 5 },
];

// ---------- negotiations in progress (use the "key" of the available books) ----------
// steps: [who, action, amount]. The first step is always the buyer's first offer.
const negotiations = [
  // seller (asha) must respond
  { book: 'alchemist', buyer: 'rohan_mehta', status: 'pending', steps: [['buyer', 'offer', 90]] },
  // buyer (karan) must respond to a counteroffer
  { book: 'dsa', buyer: 'karan_singh', status: 'pending', steps: [['buyer', 'offer', 280], ['seller', 'counter', 320]] },
  // a longer negotiation, seller (rohan) must respond
  { book: 'cleancode', buyer: 'meera_nair', status: 'pending', steps: [['buyer', 'offer', 400], ['seller', 'counter', 450], ['buyer', 'counter', 420]] },
  // price agreed: the buyer (ishita) can now see the seller's contact details
  { book: 'money', buyer: 'ishita_rao', status: 'agreed', steps: [['buyer', 'offer', 200], ['seller', 'counter', 230], ['buyer', 'accept', 230]] },
  // price agreed: asha can see vikram's contact details
  { book: 'mlpython', buyer: 'asha_verma', status: 'agreed', steps: [['buyer', 'offer', 480], ['seller', 'counter', 520], ['buyer', 'accept', 520]] },
  // rejected negotiation
  { book: 'dbms', buyer: 'vikram_joshi', status: 'rejected', steps: [['buyer', 'offer', 300], ['seller', 'reject', 300]] },
  // karan is the seller here and must respond
  { book: 'python', buyer: 'asha_verma', status: 'pending', steps: [['buyer', 'offer', 380]] },
  // karan (buyer) must respond to ishita's counteroffer
  { book: 'networks', buyer: 'karan_singh', status: 'pending', steps: [['buyer', 'offer', 330], ['seller', 'counter', 350]] },
  { book: 'wings', buyer: 'ishita_rao', status: 'pending', steps: [['buyer', 'offer', 110]] },
];

// ---------- picture generation ----------
// We create a simple SVG "book cover" for every sample book so the site has pictures.
const palettes = [
  { bg: '#6f4e37', fg: '#f5ebdc' },
  { bg: '#a47551', fg: '#fff8ee' },
  { bg: '#d9c2a3', fg: '#4a3426' },
  { bg: '#3e2a1e', fg: '#e8d5b7' },
  { bg: '#8c6a4f', fg: '#f7efe2' },
  { bg: '#c8a77e', fg: '#3b2a1d' },
];

const escapeXml = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const wrapText = (text, max) => {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  words.forEach((w) => {
    if ((line + ' ' + w).trim().length > max) {
      lines.push(line.trim());
      line = w;
    } else {
      line = (line + ' ' + w).trim();
    }
  });
  if (line) lines.push(line);
  return lines;
};

const makeCover = (index, title, author) => {
  const { bg, fg } = palettes[index % palettes.length];
  const lines = wrapText(title, 15).slice(0, 5);
  const titleSvg = lines
    .map((l, i) => `<text x="150" y="${130 + i * 34}" text-anchor="middle" font-family="Georgia, serif" font-size="26" font-weight="bold" fill="${fg}">${escapeXml(l)}</text>`)
    .join('');
  const authorLines = wrapText(author, 24).slice(0, 2);
  const authorSvg = authorLines
    .map((l, i) => `<text x="150" y="${352 + i * 20}" text-anchor="middle" font-family="Georgia, serif" font-size="15" font-style="italic" fill="${fg}">${escapeXml(l)}</text>`)
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420">
  <rect width="300" height="420" fill="${bg}"/>
  <rect x="14" y="14" width="272" height="392" fill="none" stroke="${fg}" stroke-width="2" opacity="0.6"/>
  ${titleSvg}
  <line x1="100" y1="${130 + lines.length * 34 + 6}" x2="200" y2="${130 + lines.length * 34 + 6}" stroke="${fg}" stroke-width="2" opacity="0.7"/>
  ${authorSvg}
</svg>`;

  const fileName = `seed-${index + 1}.svg`;
  fs.writeFileSync(path.join(uploadFolder, fileName), svg);
  return fileName;
};

// ---------- main ----------
const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const seed = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing. Create backend/.env first (copy .env.example).');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Clear old data and old sample pictures
    await Promise.all([User.deleteMany({}), Book.deleteMany({}), Offer.deleteMany({})]);
    fs.mkdirSync(uploadFolder, { recursive: true });
    fs.readdirSync(uploadFolder)
      .filter((f) => f.startsWith('seed-'))
      .forEach((f) => fs.unlinkSync(path.join(uploadFolder, f)));
    console.log('Old data cleared');

    // 2. Users
    const hashed = await bcrypt.hash(PASSWORD, 10);
    const users = {};
    for (const u of usersData) {
      users[u.username] = await User.create({ ...u, password: hashed });
    }

    // 3. Books for sale
    let pictureIndex = 0;
    const books = {};
    for (const b of availableBooks) {
      books[b.key] = await Book.create({
        seller: users[b.seller]._id,
        title: b.title,
        author: b.author,
        price: b.price,
        condition: b.condition,
        description: b.description,
        image: makeCover(pictureIndex++, b.title, b.author),
        status: 'available',
        createdAt: daysAgo(pictureIndex),
      });
    }

    // 4. Sold books + their completed negotiations + sales counts
    for (const s of soldBooks) {
      const soldAt = daysAgo(s.daysAgo);
      const book = await Book.create({
        seller: users[s.seller]._id,
        title: s.title,
        author: s.author,
        price: s.price,
        condition: s.condition,
        description: 'Sold through Bookbrew.',
        image: makeCover(pictureIndex++, s.title, s.author),
        status: 'sold',
        buyer: users[s.buyer]._id,
        soldPrice: s.soldPrice,
        soldAt,
        createdAt: daysAgo(s.daysAgo + 10),
      });

      const firstOffer = s.soldPrice - 40;
      await Offer.create({
        book: book._id,
        buyer: users[s.buyer]._id,
        seller: users[s.seller]._id,
        currentAmount: s.soldPrice,
        lastActor: 'buyer',
        status: 'completed',
        agreedPrice: s.soldPrice,
        history: [
          { by: 'buyer', action: 'offer', amount: firstOffer, createdAt: new Date(soldAt.getTime() - 3 * 86400000) },
          { by: 'seller', action: 'counter', amount: s.soldPrice, createdAt: new Date(soldAt.getTime() - 2 * 86400000) },
          { by: 'buyer', action: 'accept', amount: s.soldPrice, createdAt: new Date(soldAt.getTime() - 1 * 86400000) },
        ],
      });

      // count the completed sale for the seller (same as the real "complete" action does)
      await User.findByIdAndUpdate(users[s.seller]._id, { $inc: { salesCount: 1 } });
    }

    // 5. Negotiations in progress
    for (const n of negotiations) {
      const book = books[n.book];
      let current = 0;
      let lastActor = 'buyer';
      let agreedPrice = null;

      const history = n.steps.map(([by, action, amount], i) => {
        if (action === 'offer' || action === 'counter') {
          current = amount;
          lastActor = by;
        }
        if (action === 'accept') agreedPrice = amount;
        return { by, action, amount, createdAt: new Date(Date.now() - (n.steps.length - i) * 3 * 3600000) };
      });

      await Offer.create({
        book: book._id,
        buyer: users[n.buyer]._id,
        seller: book.seller,
        currentAmount: current,
        lastActor,
        status: n.status,
        agreedPrice,
        history,
      });
    }

    const finalUsers = await User.find().sort({ username: 1 });
    console.log('\nSample data inserted successfully!');
    console.log(`Users: ${finalUsers.length}, Books: ${await Book.countDocuments()}, Offers: ${await Offer.countDocuments()}`);
    console.log('\nTest logins (password for all users: ' + PASSWORD + ')');
    finalUsers.forEach((u) => console.log(`  ${u.email.padEnd(20)} ${u.username.padEnd(14)} completed sales: ${u.salesCount}`));
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();
