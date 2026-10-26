import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          Bookbrew
        </Link>
        <nav className="nav-links">
          <NavLink to="/books">Browse</NavLink>
          {user ? (
            <>
              <NavLink to="/sell">Sell a Book</NavLink>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <span className="nav-user">
                {user.username} ({user.salesCount} sold)
              </span>
              <button className="btn btn-small btn-outline" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <Link to="/register" className="btn btn-small">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
