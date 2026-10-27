import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/home.css";

function Home({ setUser }) {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // Runs once when the page loads (and again on every refresh),
    // so the list always shows the newest books first.
    useEffect(function () {
        axios
            .get("/api/books")
            .then(function (response) {
                setBooks(response.data);
                setLoading(false);
            })
            .catch(function () {
                setLoading(false);
            });
    }, []);

    // Search by book name
    const filteredBooks = books.filter(function (book) {
        return book.title.toLowerCase().includes(search.toLowerCase().trim());
    });

    return (
        <>
        <Header setUser={setUser} />

        <div className="home-page">

            {/* ================= HERO ================= */}

            <section className="hero">

                <div className="hero-content">

                    <p className="hero-label">
                        WELCOME TO RELEAFBOOK
                    </p>

                    <h1>
                        Give Books a
                        <span> Second Life.</span>
                    </h1>

                    <p className="hero-text">
                        Discover affordable books from fellow readers,
                        sell the books you no longer need, and give every
                        book a chance to be read again.
                    </p>

                </div>

            </section>


            {/* ================= MAIN ================= */}

            <main>

                <section className="browse-section">

                    {/* SECTION HEADING */}

                    <div className="section-title">

                        <div>

                            <p className="small-heading">
                                EXPLORE
                            </p>

                            <h2>
                                Find Your Next Book
                            </h2>

                        </div>

                        <p className="available-text">
                            {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"} available
                        </p>

                    </div>


                    {/* ================= SEARCH ================= */}

                    <div className="search-area">

                        <div className="search-box">

                            <span>
                                🔍
                            </span>

                            <input
                                type="text"
                                placeholder="Search by book name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                        </div>

                    </div>


                    {/* ================= BOOK GRID ================= */}

                    <div className="books-grid">

                        {filteredBooks.map(function (book) {
                            return (
                                <div className="book-card" key={book._id}>

                                    <div className="book-image">
                                        <img
                                            src={book.image}
                                            alt={book.title}
                                        />
                                    </div>

                                    <div className="book-info">

                                        <h3>
                                            {book.title}
                                        </h3>

                                        <p className="author">
                                            by {book.author}
                                        </p>

                                        <p className="seller">
                                            Seller: {book.seller?.username}
                                        </p>

                                        <strong className="price">
                                            ₹{book.price}
                                        </strong>

                                        <p className="contact">
                                            <strong>Contact:</strong> {book.contact}
                                        </p>

                                    </div>

                                </div>
                            );
                        })}

                    </div>


                    {/* ================= NO RESULTS ================= */}

                    {!loading && filteredBooks.length === 0 && (
                        <div className="no-results">

                            <div>
                                📚
                            </div>

                            <h3>
                                No books found
                            </h3>

                            <p>
                                Try searching for another book name.
                            </p>

                        </div>
                    )}

                </section>

            </main>

        </div>

        <Footer />
        </>
    );
}

export default Home;
