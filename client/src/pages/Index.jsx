import { Link } from "react-router-dom";
import IndexHeader from "../components/IndexHeader";
import IndexFooter from "../components/IndexFooter";
import "../css/index.css";

function Index() {
    return (
        <>
        <IndexHeader />

        <div className="index-page">

            {/* ================= HERO SECTION ================= */}

            <section className="home-hero">

                {/* Hero Text */}

                <div className="hero-content">

                    <p className="small-heading">
                        BUY • SELL • REUSE
                    </p>

                    <h1>
                        Give Your Books
                        <br />
                        A <span>Second Life.</span>
                    </h1>

                    <p className="hero-description">
                        Discover affordable books from fellow readers
                        or give your old books a new home.
                    </p>

                    <div className="hero-buttons">

                        <Link to="/login" className="explore-btn">
                            Login
                        </Link>

                        <Link to="/register" className="secondary-btn">
                            Register
                        </Link>

                    </div>

                </div>

                {/* Hero Image */}

                <div className="hero-image">

                    <img
                        src="/images/hero-books.jpg"
                        alt="A collection of books"
                    />

                    <div className="image-tag">

                        📖

                        <span>
                            Every book deserves
                            another reader.
                        </span>

                    </div>

                </div>

            </section>


            {/* ================= ABOUT SECTION ================= */}

            <section id="about" className="about-section">

                <div className="about-box">

                    {/* About Text */}

                    <div className="about-content">

                        <p className="small-heading">
                            ABOUT RELEAFBOOK
                        </p>

                        <h2>
                            Books Should Keep
                            <span> Travelling.</span>
                        </h2>

                        <p className="about-text">
                            ReleafBook is a simple platform where
                            students and book lovers can buy and sell
                            used books. Sellers list a book with its picture,
                            price and contact details, and buyers contact
                            the seller directly.
                        </p>

                        <p className="about-text">
                            Instead of letting books sit unused on a
                            shelf, give them a second life with another
                            reader.
                        </p>

                        <Link to="/register" className="about-btn">
                            Join ReleafBook
                        </Link>

                    </div>

                    {/* About Image */}

                    <div className="about-image">

                        <img
                            src="/images/about-books.jpg"
                            alt="Books and reading"
                        />

                    </div>

                </div>

            </section>


            {/* ================= WHY RELEAFBOOK ================= */}

            <section className="why-section">

                <p className="small-heading">
                    WHY RELEAFBOOK?
                </p>

                <h2 className="section-title">
                    A Simple Way to Reuse Books
                </h2>

                <div className="why-container">

                    {/* Card 1 */}

                    <div className="why-card">

                        <div className="feature-icon">
                            💰
                        </div>

                        <h3>
                            Affordable
                        </h3>

                        <p>
                            Find quality books at
                            student-friendly prices.
                        </p>

                    </div>

                    {/* Card 2 */}

                    <div className="why-card">

                        <div className="feature-icon">
                            ♻️
                        </div>

                        <h3>
                            Reuse
                        </h3>

                        <p>
                            Give your old books a new
                            home instead of wasting them.
                        </p>

                    </div>

                    {/* Card 3 */}

                    <div className="why-card">

                        <div className="feature-icon">
                            🤝
                        </div>

                        <h3>
                            Connect
                        </h3>

                        <p>
                            Connect with readers who
                            are looking for your books.
                        </p>

                    </div>

                    {/* Card 4 */}

                    <div className="why-card">

                        <div className="feature-icon">
                            📚
                        </div>

                        <h3>
                            Discover
                        </h3>

                        <p>
                            Discover interesting books
                            without spending too much.
                        </p>

                    </div>

                </div>

            </section>


            {/* ================= HOW IT WORKS ================= */}

            <section className="how-section">

                <p className="small-heading">
                    HOW IT WORKS
                </p>

                <h2 className="section-title">
                    Start in Three Simple Steps
                </h2>

                <div className="steps">

                    <div className="step">

                        <div className="step-number">
                            1
                        </div>

                        <h3>
                            Create an Account
                        </h3>

                        <p>
                            Register on ReleafBook and
                            become part of our community.
                        </p>

                    </div>

                    <div className="step">

                        <div className="step-number">
                            2
                        </div>

                        <h3>
                            Buy or Sell
                        </h3>

                        <p>
                            Find books you want or list
                            books that you no longer need.
                        </p>

                    </div>

                    <div className="step">

                        <div className="step-number">
                            3
                        </div>

                        <h3>
                            Connect
                        </h3>

                        <p>
                            Connect with other readers
                            and give books a second life.
                        </p>

                    </div>

                </div>

            </section>

        </div>

        <IndexFooter />
        </>
    );
}

export default Index;
