import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/sell.css";

function Sell({ user, setUser }) {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [price, setPrice] = useState("");
    const [contact, setContact] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [message, setMessage] = useState("");

    // When a picture is chosen, remember it and show a small preview
    function handleImageChange(event) {
        const file = event.target.files[0];

        if (!file) {
            setImage(null);
            setPreview("");
            return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!image) {
            setMessage("Please upload a picture of the book.");
            return;
        }

        // A picture can not be sent as plain JSON, so FormData is used
        const formData = new FormData();
        formData.append("userId", user._id);
        formData.append("title", title);
        formData.append("author", author);
        formData.append("price", price);
        formData.append("contact", contact);
        formData.append("image", image);

        try {
            await axios.post("/api/books", formData);
            navigate("/home");
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong.");
        }
    }

    return (
        <>
        <Header setUser={setUser} />

        <div className="sell-page">

            {/* ================= LISTING PAGE ================= */}

            <section className="listing-page">

                <div className="listing-intro">

                    <p className="small-heading">
                        SELL YOUR BOOK
                    </p>

                    <h1>
                        List a New Book
                    </h1>

                    <p>
                        Add the details of your book and
                        give it a new reader.
                    </p>

                </div>


                {/* ================= FORM ================= */}

                <div className="listing-form-container">

                    <form onSubmit={handleSubmit}>

                        {/* ================= BOOK PHOTO ================= */}

                        <div className="photo-upload-section">

                            <h3>
                                Book Picture ⭐
                            </h3>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />

                            <div className="photo-preview-container">

                                {preview && (
                                    <div className="photo-preview">
                                        <img src={preview} alt="Book preview" />
                                    </div>
                                )}

                            </div>

                        </div>


                        {/* ================= BOOK NAME ================= */}

                        <label htmlFor="book-title">
                            Book Name
                        </label>

                        <input
                            type="text"
                            id="book-title"
                            placeholder="Enter book name"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />


                        {/* ================= AUTHOR ================= */}

                        <label htmlFor="author">
                            Author
                        </label>

                        <input
                            type="text"
                            id="author"
                            placeholder="Enter author name"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                        />


                        {/* ================= PRICE ================= */}

                        <label htmlFor="price">
                            Asking Price
                        </label>

                        <input
                            type="number"
                            id="price"
                            placeholder="Enter price in ₹"
                            min="1"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />


                        {/* ================= CONTACT INFO ================= */}

                        <label htmlFor="contact">
                            Contact Info
                        </label>

                        <textarea
                            id="contact"
                            rows="4"
                            placeholder="Phone number, email, Instagram id... anything buyers can use to reach you"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            required
                        ></textarea>

                        <small>
                            This will be shown to buyers on the book listing.
                        </small>


                        {/* ================= MESSAGE ================= */}

                        <p className="form-error">
                            {message}
                        </p>


                        {/* ================= BUTTONS ================= */}

                        <div className="form-buttons">

                            <Link to="/home" className="cancel-btn">
                                Cancel
                            </Link>

                            <button type="submit" className="submit-book-btn">
                                List My Book
                            </button>

                        </div>

                    </form>

                </div>

            </section>

        </div>

        <Footer />
        </>
    );
}

export default Sell;
