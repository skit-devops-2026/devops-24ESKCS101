import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { formatDate, formatPrice, getError, imageUrl, statusText } from '../utils.js';

const TABS = ['My Listings', 'Incoming Offers', 'My Offers', 'My Sales', 'My Purchases'];

export default function Dashboard() {
  const [tab, setTab] = useState('My Listings');
  const [data, setData] = useState({ listings: [], incoming: [], mine: [], sales: [], purchases: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load all five lists at once
  const loadAll = useCallback(async () => {
    try {
      const [listings, incoming, mine, sales, purchases] = await Promise.all([
        api.get('/books/mine'),
        api.get('/offers/incoming'),
        api.get('/offers/mine'),
        api.get('/books/my-sales'),
        api.get('/books/my-purchases'),
      ]);
      setData({
        listings: listings.data,
        incoming: incoming.data,
        mine: mine.data,
        sales: sales.data,
        purchases: purchases.data,
      });
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleDelete = async (book) => {
    if (!window.confirm(`Delete "${book.title}"? Any offers on it will also be removed.`)) return;
    try {
      await api.delete(`/books/${book._id}`);
      loadAll();
    } catch (err) {
      setError(getError(err));
    }
  };

  // How many negotiations are waiting for ME to respond
  const waiting = (list) => list.filter((o) => o.myTurn).length;
  const badge = { 'Incoming Offers': waiting(data.incoming), 'My Offers': waiting(data.mine) };

  return (
    <>
      <div className="row-between">
        <h1>Dashboard</h1>
        <Link className="btn" to="/sell">+ Sell a book</Link>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} className={tab === t ? 'tab active' : 'tab'} onClick={() => setTab(t)}>
            {t}
            {badge[t] > 0 && <span className="tab-badge">{badge[t]}</span>}
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="notice">Loading...</p>
      ) : (
        <>
          {tab === 'My Listings' && <Listings books={data.listings} onDelete={handleDelete} />}
          {tab === 'Incoming Offers' && <Offers offers={data.incoming} otherParty="buyer" empty="No one has made an offer on your books yet." />}
          {tab === 'My Offers' && <Offers offers={data.mine} otherParty="seller" empty="You have not made any offers yet. Browse books to get started." />}
          {tab === 'My Sales' && <Sales books={data.sales} />}
          {tab === 'My Purchases' && <Purchases books={data.purchases} />}
        </>
      )}
    </>
  );
}

function Listings({ books, onDelete }) {
  if (books.length === 0) return <p className="notice">You have not posted any books yet.</p>;
  return (
    <div className="list">
      {books.map((book) => (
        <div className="list-item" key={book._id}>
          <img src={imageUrl(book.image)} alt={book.title} />
          <div className="list-info">
            <h3><Link to={`/books/${book._id}`}>{book.title}</Link></h3>
            <p className="muted">by {book.author}</p>
            <p>
              {formatPrice(book.price)} &middot; {book.condition}{' '}
              <span className={book.status === 'sold' ? 'status status-done' : 'status status-open'}>
                {book.status === 'sold' ? 'Sold' : 'Available'}
              </span>
            </p>
          </div>
          <div className="button-row">
            <Link className="btn btn-small btn-outline" to={`/books/${book._id}`}>View</Link>
            {book.status === 'available' && (
              <>
                <Link className="btn btn-small" to={`/books/${book._id}/edit`}>Edit</Link>
                <button className="btn btn-small btn-danger" onClick={() => onDelete(book)}>Delete</button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function Offers({ offers, otherParty, empty }) {
  if (offers.length === 0) return <p className="notice">{empty}</p>;
  return (
    <div className="list">
      {offers.map((o) => (
        <div className="list-item" key={o._id}>
          <img src={imageUrl(o.book.image)} alt={o.book.title} />
          <div className="list-info">
            <h3>{o.book.title}</h3>
            <p className="muted">
              {otherParty === 'buyer' ? 'Buyer' : 'Seller'}: {o[otherParty].username} &middot; Asking {formatPrice(o.book.price)}
            </p>
            <p>
              Current offer: <strong>{formatPrice(o.currentAmount)}</strong>{' '}
              <span className={`status status-${o.status}`}>{statusText[o.status]}</span>
              {o.myTurn && <span className="status status-turn">Your turn</span>}
            </p>
          </div>
          <Link className="btn btn-small" to={`/offers/${o._id}`}>Open</Link>
        </div>
      ))}
    </div>
  );
}

function Sales({ books }) {
  if (books.length === 0) return <p className="notice">You have not sold any books yet.</p>;
  return (
    <div className="list">
      {books.map((b) => (
        <div className="list-item" key={b._id}>
          <img src={imageUrl(b.image)} alt={b.title} />
          <div className="list-info">
            <h3>{b.title}</h3>
            <p className="muted">by {b.author}</p>
            <p>
              Sold to <strong>{b.buyer?.username}</strong> for <strong>{formatPrice(b.soldPrice)}</strong> on {formatDate(b.soldAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Purchases({ books }) {
  if (books.length === 0) return <p className="notice">You have not bought any books yet.</p>;
  return (
    <div className="list">
      {books.map((b) => (
        <div className="list-item" key={b._id}>
          <img src={imageUrl(b.image)} alt={b.title} />
          <div className="list-info">
            <h3>{b.title}</h3>
            <p className="muted">by {b.author}</p>
            <p>
              Bought from <strong>{b.seller?.username}</strong> for <strong>{formatPrice(b.soldPrice)}</strong> on {formatDate(b.soldAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
