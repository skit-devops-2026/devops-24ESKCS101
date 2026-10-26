// ================= IMPORTS =================
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// Uploaded book pictures are served from /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= ROUTES =================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/books", require("./routes/books"));

// ================= CONNECT DATABASE, THEN START SERVER =================
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(function () {
        console.log("MongoDB connected");
        app.listen(PORT, function () {
            console.log("Server running on http://localhost:" + PORT);
        });
    })
    .catch(function (error) {
        console.log("MongoDB connection failed:", error.message);
    });
