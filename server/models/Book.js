const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        author: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 1 },
        contact: { type: String, required: true, trim: true },
        image: { type: String, required: true },

        seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        
        
        status: {
            type: String,
            enum: ["listed", "sold", "deleted"],
            default: "listed"
        }
    },
    { timestamps: true } 
);

module.exports = mongoose.model("Book", bookSchema);
