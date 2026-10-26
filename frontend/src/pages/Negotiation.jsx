import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api.js';
import { formatDateTime, formatPrice, getError, imageUrl, statusText, whatsappLink } from '../utils.js';

export default function Negotiation() {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [counter, setCounter] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadOffer = useCallback(async () => {
    try {
      const res = await api.get(`/offers/${id}`);
      setOffer(res.data);
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOffer();
  }, [loadOffer]);

  // Sends an action to the server, then reloads the negotiation
  const doAction = async (url, body) => {
    setError('');
    try {
      await api.post(`/offers/${id}/${url}`, body);
      setCounter('');
      await loadOffer();
    } catch (err) {
      setError(getError(err));
      loadOffer();
    }
  };

  const handleCounter = (e) => {
    e.preventDefault();
    doAction('respond', { action: 'counter', amount: counter });
  };

  const confirmThen = (message, fn) => {
    if (window.confirm(message)) fn();
  };

  if (loading) return <p className="notice">Loading...</p>;
  if (!offer) return <p className="error">{error || 'Negotiation not found.'}</p>;

  const isBuyer = offer.role === 'buyer';
  const otherName = isBuyer ? offer.seller.username : offer.buyer.username;
  const youOrThem = (by) => (by === offer.role ? 'You' : otherName);

  // Turns one history entry into a readable sentence
  const describe = (h) => {
    const who = youOrThem(h.by);
    if (h.action === 'offer') return `${who} offered ${formatPrice(h.amount)}`;
    if (h.action === 'counter') return `${who} countered with ${formatPrice(h.amount)}`;
    if (h.action === 'accept') return `${who} accepted ${formatPrice(h.amount)}`;
    if (h.action === 'reject') return `${who} rejected ${formatPrice(h.amount)}`;
    return `${who} cancelled the negotiation`;
  };

  return (
    <>
      <p><Link to="/dashboard">&larr; Back to dashboard</Link></p>
      <h1>Negotiation</h1>

      <div className="neg-layout">
        {/* Left: the book */}
        <div className="box">
          <Link to={`/books/${offer.book._id}`} className="mini-book">
            <img src={imageUrl(offer.book.image)} alt={offer.book.title} />
            <div>
              <h3>{offer.book.title}</h3>
              <p className="muted">by {offer.book.author}</p>
              <p>Asking price: {formatPrice(offer.book.price)}</p>
            </div>
          </Link>
          <p>
            {isBuyer ? 'Seller' : 'Buyer'}: <strong>{otherName}</strong>
            {isBuyer && <> &middot; {offer.seller.salesCount} sales completed</>}
          </p>
          <p>
            Status: <span className={`status status-${offer.status}`}>{statusText[offer.status]}</span>
          </p>
          <p className="current-offer">
            {offer.status === 'agreed' || offer.status === 'completed' ? 'Agreed price' : 'Current offer'}
            <span>{formatPrice(offer.status === 'agreed' || offer.status === 'completed' ? offer.agreedPrice : offer.currentAmount)}</span>
          </p>
        </div>

        {/* Right: history + actions */}
        <div>
          <div className="box">
            <h3>Negotiation history</h3>
            <ul className="history">
              {offer.history.map((h, i) => (
                <li key={i} className={h.by === offer.role ? 'mine' : ''}>
                  {describe(h)}
                  <small>{formatDateTime(h.createdAt)}</small>
                </li>
              ))}
            </ul>
          </div>

          {error && <p className="error">{error}</p>}

          {/* ----- pending: whose turn is it? ----- */}
          {offer.status === 'pending' && offer.myTurn && (
            <div className="box">
              <h3>{otherName} offered {formatPrice(offer.currentAmount)}. What would you like to do?</h3>
              <div className="button-row">
                <button className="btn" onClick={() => confirmThen(`Accept ${formatPrice(offer.currentAmount)}?`, () => doAction('respond', { action: 'accept' }))}>
                  Accept
                </button>
                <button className="btn btn-danger" onClick={() => confirmThen('Reject this offer? The negotiation will end.', () => doAction('respond', { action: 'reject' }))}>
                  Reject
                </button>
              </div>
              <form className="counter-form" onSubmit={handleCounter}>
                <label>Or make a counteroffer (₹)</label>
                <div className="inline">
                  <input type="number" min="1" value={counter} onChange={(e) => setCounter(e.target.value)} required />
                  <button className="btn btn-outline" type="submit">Send counteroffer</button>
                </div>
              </form>
            </div>
          )}

          {offer.status === 'pending' && !offer.myTurn && (
            <div className="box">
              <p>Waiting for <strong>{otherName}</strong> to respond to your offer of {formatPrice(offer.currentAmount)}.</p>
            </div>
          )}

          {/* ----- agreed ----- */}
          {offer.status === 'agreed' && isBuyer && (
            <div className="box contact">
              <h3>Price agreed: {formatPrice(offer.agreedPrice)}</h3>
              <p>Contact {offer.seller.username} to arrange payment and delivery:</p>
              <ul className="contact-list">
                <li>Phone: <a href={`tel:${offer.seller.phone}`}>{offer.seller.phone}</a></li>
                <li>Email: <a href={`mailto:${offer.seller.email}`}>{offer.seller.email}</a></li>
                <li>WhatsApp: <a href={whatsappLink(offer.seller.phone)} target="_blank" rel="noreferrer">Open chat</a></li>
              </ul>
              <p className="muted">The seller will mark the sale as completed once the book is handed over.</p>
            </div>
          )}

          {offer.status === 'agreed' && !isBuyer && (
            <div className="box contact">
              <h3>Price agreed: {formatPrice(offer.agreedPrice)}</h3>
              <p>
                {offer.buyer.username} can now see your contact details and will get in touch to arrange payment and
                delivery. After you have handed over the book, mark the sale as completed.
              </p>
              <button className="btn" onClick={() => confirmThen('Mark this sale as completed? The book will be marked as sold.', () => doAction('complete'))}>
                Mark sale as completed
              </button>
            </div>
          )}

          {(offer.status === 'pending' || offer.status === 'agreed') && (
            <button className="btn btn-outline" onClick={() => confirmThen('Cancel this negotiation?', () => doAction('cancel'))}>
              Cancel negotiation
            </button>
          )}

          {/* ----- finished states ----- */}
          {offer.status === 'completed' && (
            <div className="box contact">
              <h3>Sale completed at {formatPrice(offer.agreedPrice)}</h3>
              {isBuyer ? (
                <p>This book is now in your purchases.</p>
              ) : (
                <p>This sale was added to your completed sales count.</p>
              )}
            </div>
          )}
          {offer.status === 'rejected' && <p className="notice">This negotiation ended because an offer was rejected.</p>}
          {offer.status === 'cancelled' && <p className="notice">This negotiation was cancelled.</p>}
          {offer.status === 'closed' && <p className="notice">This book was sold to someone else, so the negotiation is closed.</p>}
        </div>
      </div>
    </>
  );
}
