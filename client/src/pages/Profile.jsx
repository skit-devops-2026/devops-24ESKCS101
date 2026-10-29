import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/profile.css";

function Profile({ user, setUser }) {
    const [books, setBooks] = useState([]);

    
    const [editId, setEditId] = useState(null);
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [price, setPrice] = useState("");
    const [contact, setContact] = useState("");
    const [newImage, setNewImage] = useState(null);

    
    function loadBooks() {
        axios
            .get("/api/books/user/" + user._id)
            .then(function (response) {
                setBooks(response.data);
            });
    }

    useEffect(function () {
        loadBooks();
    }, []);

    
    const listedBooks = books.filter((book) => book.status === "listed");
    const soldBooks = books.filter((book) => book.status === "sold");
    const deletedBooks = books.filter((book) => book.status === "deleted");

    const profit = soldBooks.reduce((total, book) => total + book.price, 0);

    
    function startEdit(book) {
        setEditId(book._id);
        setTitle(book.title);
        setAuthor(book.author);
        setPrice(book.price);
        setContact(book.contact);
        setNewImage(null);
    }

    async function saveEdit(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append("userId", user._id);
        formData.append("title", title);
        formData.append("author", author);
        formData.append("price", price);
        formData.append("contact", contact);

        if (newImage) {
            formData.append("image", newImage);
        }

        await axios.put("/api/books/" + editId, formData);

        setEditId(null);
        loadBooks();
    }

    
    async function markSold(id) {
        if (!window.confirm("Mark this book as sold?")) return;

        await axios.put("/api/books/" + id + "/sold", { userId: user._id });
        loadBooks();
    }

    
    async function deleteBook(id) {
        if (!window.confirm("Remove this book from your listings?")) return;

        await axios.delete("/api/books/" + id, { params: { userId: user._id } });
        loadBooks();
    }

    return (
        <>
        <Header setUser={setUser} />

        <div className="profile-page">



            <section className="page-header">

                <p className="small-heading">
                    MY PROFILE
                </p>

                <h1>
                    {user.username}
                </h1>

                <p className="page-description">
                    {user.email}
                </p>

            </section>


            <main className="profile-section">



                <div className="stats-container">

                    <div className="stat-card">
                        <div className="stat-icon">📚</div>
                        <div>
                            <p>Books Listed Till Now</p>
                            <h2>{books.length}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🏷️</div>
                        <div>
                            <p>Currently For Sale</p>
                            <h2>{listedBooks.length}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">✓</div>
                        <div>
                            <p>Books Sold</p>
                            <h2>{soldBooks.length}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">✕</div>
                        <div>
                            <p>Books Deleted</p>
                            <h2>{deletedBooks.length}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">₹</div>
                        <div>
                            <p>Total Profit</p>
                            <h2>₹{profit}</h2>
                        </div>
                    </div>

                </div>




                <div className="listings-top">

                    <div>

                        <h2>
                            My Listed Books
                        </h2>

                        <p>
                            Update, delete or mark your books as sold.
                        </p>

                    </div>

                    <Link to="/sell" className="list-book-btn">
                        + List a New Book
                    </Link>

                </div>




                <div id="listings-container">

                    {listedBooks.length === 0 && (
                        <div className="no-listings">

                            <h2>
                                No books listed
                            </h2>

                            <p>
                                You have no books for sale right now.
                            </p>

                            <Link to="/sell" className="list-book-btn">
                                + List a New Book
                            </Link>

                        </div>
                    )}

                    {listedBooks.map(function (book) {


                        if (book._id === editId) {
                            return (
                                <div className="listing-card" key={book._id}>

                                    <div className="listing-details">

                                        <form className="edit-form" onSubmit={saveEdit}>

                                            <label>Book Name</label>
                                            <input
                                                type="text"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                required
                                            />

                                            <label>Author</label>
                                            <input
                                                type="text"
                                                value={author}
                                                onChange={(e) => setAuthor(e.target.value)}
                                                required
                                            />

                                            <label>Asking Price (₹)</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                required
                                            />

                                            <label>Contact Info</label>
                                            <textarea
                                                rows="3"
                                                value={contact}
                                                onChange={(e) => setContact(e.target.value)}
                                                required
                                            ></textarea>

                                            <label>New Picture (optional)</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setNewImage(e.target.files[0])}
                                            />

                                            <div className="listing-actions">

                                                <button type="submit" className="sold-btn">
                                                    Save
                                                </button>

                                                <button
                                                    type="button"
                                                    className="delete-btn"
                                                    onClick={() => setEditId(null)}
                                                >
                                                    Cancel
                                                </button>

                                            </div>

                                        </form>

                                    </div>

                                </div>
                            );
                        }

                        
                        return (
                            <div className="listing-card" key={book._id}>

                                <img src={book.image} alt={book.title} />

                                <div className="listing-details">

                                    <h3>
                                        {book.title}
                                    </h3>

                                    <p className="listing-author">
                                        by {book.author}
                                    </p>

                                    <p className="listing-price">
                                        ₹{book.price}
                                    </p>

                                    <p className="listing-contact">
                                        <strong>Contact:</strong> {book.contact}
                                    </p>

                                    <div className="listing-actions">

                                        <button className="edit-btn" onClick={() => startEdit(book)}>
                                            Edit
                                        </button>

                                        <button className="sold-btn" onClick={() => markSold(book._id)}>
                                            Sold
                                        </button>

                                        <button className="delete-btn" onClick={() => deleteBook(book._id)}>
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </div>
                        );
                    })}

                </div>

            </main>

        </div>

        <Footer />
        </>
    );
}

export default Profile;
