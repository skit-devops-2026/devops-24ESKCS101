import { Link } from "react-router-dom";
import "../css/indexheader.css";

// Header used only on the index page (visitors who are not logged in)
function IndexHeader() {
    return (
        <header className="index-navbar">

            {/* Logo */}
            <Link to="/" className="logo">
                📚 ReleafBook
            </Link>

            {/* Public Navigation */}
            <nav className="nav-links">

                <Link to="/">Home</Link>

                <Link to="/login" className="login-btn">
                    Login
                </Link>

                <Link to="/register" className="register-btn">
                    Register
                </Link>

            </nav>

        </header>
    );
}

export default IndexHeader;
