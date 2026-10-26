import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Landing from './pages/Landing.jsx';
import Browse from './pages/Browse.jsx';
import BookDetail from './pages/BookDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import BookForm from './pages/BookForm.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Negotiation from './pages/Negotiation.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/books" element={<Browse />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* These pages need the user to be logged in */}
          <Route path="/sell" element={<ProtectedRoute><BookForm /></ProtectedRoute>} />
          <Route path="/books/:id/edit" element={<ProtectedRoute><BookForm /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/offers/:id" element={<ProtectedRoute><Negotiation /></ProtectedRoute>} />

          <Route path="*" element={<p className="notice">Page not found.</p>} />
        </Routes>
      </main>
      <footer className="footer">Bookbrew - a college project. Fictional sample data only.</footer>
    </>
  );
}
