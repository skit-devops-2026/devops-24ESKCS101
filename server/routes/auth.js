const express = require("express");
const User = require("../models/User");

const router = express.Router();

// ================= REGISTER =================
// POST /api/auth/register   body: { username, email, password }
router.post("/register", async function (req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields." });
        }

        const emailTaken = await User.findOne({ email: email.toLowerCase() });
        if (emailTaken) {
            return res.status(400).json({ message: "This email is already registered." });
        }

        const usernameTaken = await User.findOne({ username: username });
        if (usernameTaken) {
            return res.status(400).json({ message: "This username is already taken." });
        }

        const user = await User.create({ username, email, password });

        res.json({ _id: user._id, username: user.username, email: user.email });
    } catch (error) {
        res.status(500).json({ message: "Server error. Please try again." });
    }
});

// ================= LOGIN =================
// POST /api/auth/login   body: { email, password }
router.post("/login", async function (req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email: (email || "").toLowerCase(),
            password: password
        });

        if (!user) {
            return res.status(401).json({ message: "Wrong email or password." });
        }

        res.json({ _id: user._id, username: user.username, email: user.email });
    } catch (error) {
        res.status(500).json({ message: "Server error. Please try again." });
    }
});

module.exports = router;
