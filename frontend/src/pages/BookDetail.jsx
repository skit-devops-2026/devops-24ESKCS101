import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatDate, formatPrice, getError, imageUrl } from '../utils.js';

export default function BookDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [activeOffer, setActiveOffer] = useState(null); // my running negotiation for this book
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/books/${id}`)
      .then((res) => {
        setBook(res.data);
        setAmount(res.data.price);
      })
      .catch((err) => setError(getError(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = user && book && String(book.seller._id) === String(user.id);

  // If I am logged in and not the owner, check if I already started a negotiation
  useEffect(() => {
    if (user && book && !isOwner && book.status === 'available') {
      api.get(`/offers/for-book/${id}`).then((res) => setActiveOffer(res.data));
    }
  }, [user, book, isOwner, id]);

  const handleOffer = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/offers', { bookId: id, amount });
      navigate(`/offers/${res.data.offerId}`);
    } catch (err) {
      setError(getError(err));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing? Any offers on it will also be removed.')) return;
    try {
      await api.delete(`/books/${id}`);
      navigate('/dashboard');
    } catch (err) {
      setError(getError(err));
    }
  };

  if (loading) return <p className="notice">Loading...</p>;
  if (!book) return <p className="error">{error || 'Book not found.'}</p>;

  return (
    <div className="detail">
      <img className="detail-image" src={imageUrl(book.image)} alt={book.title} />

      <div className="detail-info">
        <h1>{book.title}</h1>
        <p className="muted">by {book.author}</p>
        <p className="price big">{formatPrice(book.price)}</p>
        <p><span className="badge">{book.condition}</span></p>

        {book.description && <p>{book.description}</p>}

        <p className="seller-line">
          Seller: <strong>{book.seller.username}</strong> &middot; {book.seller.salesCount}{' '}
          {book.seller.salesCount === 1 ? 'sale' : 'sales'} completed
        </p>
        <p className="muted">Listed on {formatDate(book.createdAt)}</p>

        {error && <p className="error">{error}</p>}

        {book.status === 'sold' ? (
          <p className="notice sold">This book has been sold.</p>
        ) : isOwner ? (
          <div className="box">
            <p>This is your listing.</p>
            <div className="button-row">
              <Link className="btn" to={`/books/${book._id}/edit`}>Edit</Link>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              <Link className="btn btn-outline" to="/dashboard">See offers in Dashboard</Link>
            </div>
          </div>
        ) : !user ? (
          <div className="box">
            <p>Want this book? Log in to make an offer.</p>
            <Link className="btn" to="/login" state={{ from: `/books/${book._id}` }}>Log in</Link>
          </div>
        ) : activeOffer ? (
          <div className="box">
            <p>You already have a negotiation going for this book.</p>
            <Link className="btn" to={`/offers/${activeOffer.offerId}`}>Open negotiation</Link>
          </div>
        ) : (
          <form className="box" onSubmit={handleOffer}>
            <label>Your offer (₹)</label>
            <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <button className="btn" type="submit">Make an offer</button>
          </form>
        )}
      </div>
    </div>
  );
}
