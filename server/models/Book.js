const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        author: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 1 },
        contact: { type: String, required: true, trim: true },
        image: { type: String, required: true }, // example: /uploads/1712345678.jpg

        seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        // listed  -> visible on the home page
        // sold    -> marked as sold by the seller
        // deleted -> removed from listing (kept in database so we can count it)
        status: {
            type: String,
            enum: ["listed", "sold", "deleted"],
            default: "listed"
        }
    },
    { timestamps: true } // adds createdAt and updatedAt automatically
);

module.exports = mongoose.model("Book", bookSchema);
