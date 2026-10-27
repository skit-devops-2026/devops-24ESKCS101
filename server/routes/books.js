const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Book = require("../models/Book");

const router = express.Router();

// ================= IMAGE UPLOAD SETTINGS =================
const uploadFolder = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: function (req, file, cb) {
        cb(null, file.mimetype.startsWith("image/"));
    }
});

// ================= GET ALL BOOKS FOR SALE (home page) =================
// GET /api/books   -> newest first
router.get("/", async function (req, res) {
    try {
        const books = await Book.find({ status: "listed" })
            .sort({ createdAt: -1 })
            .populate("seller", "username");

        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Could not load books." });
    }
});

// ================= GET ONE USER'S BOOKS (profile page) =================
// GET /api/books/user/:userId   -> every book of this user (listed, sold, deleted)
router.get("/user/:userId", async function (req, res) {
    try {
        const books = await Book.find({ seller: req.params.userId }).sort({ createdAt: -1 });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Could not load your books." });
    }
});

// ================= LIST A NEW BOOK =================
// POST /api/books   form-data: image, title, author, price, contact, userId
router.post("/", upload.single("image"), async function (req, res) {
    try {
        const { title, author, price, contact, userId } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Please upload a picture of the book." });
        }
        if (!title || !author || !price || !contact || !userId) {
            return res.status(400).json({ message: "Please fill in all fields." });
        }

        const book = await Book.create({
            title,
            author,
            price,
            contact,
            image: "/uploads/" + req.file.filename,
            seller: userId
        });

        res.json(book);
    } catch (error) {
        res.status(500).json({ message: "Could not list the book." });
    }
});

// ================= UPDATE A BOOK =================
// PUT /api/books/:id   form-data: title, author, price, contact, userId, image (optional)
router.put("/:id", upload.single("image"), async function (req, res) {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found." });
        }
        if (book.seller.toString() !== req.body.userId) {
            return res.status(403).json({ message: "This is not your book." });
        }

        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.price = req.body.price || book.price;
        book.contact = req.body.contact || book.contact;

        if (req.file) {
            book.image = "/uploads/" + req.file.filename;
        }

        await book.save();
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: "Could not update the book." });
    }
});

// ================= MARK AS SOLD =================
// PUT /api/books/:id/sold   body: { userId }
router.put("/:id/sold", async function (req, res) {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found." });
        }
        if (book.seller.toString() !== req.body.userId) {
            return res.status(403).json({ message: "This is not your book." });
        }

        book.status = "sold";
        await book.save();
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: "Could not mark the book as sold." });
    }
});

// ================= DELETE FROM LISTING =================
// DELETE /api/books/:id?userId=...
// The book is not erased. Its status becomes "deleted" so the profile page can count it.
router.delete("/:id", async function (req, res) {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found." });
        }
        if (book.seller.toString() !== req.query.userId) {
            return res.status(403).json({ message: "This is not your book." });
        }

        book.status = "deleted";
        await book.save();
        res.json({ message: "Book removed from listing." });
    } catch (error) {
        res.status(500).json({ message: "Could not delete the book." });
    }
});

module.exports = router;
