import { Link } from 'react-router-dom';
import { formatPrice, imageUrl } from '../utils.js';

// One book in the browse grid
export default function BookCard({ book }) {
  return (
    <Link to={`/books/${book._id}`} className="book-card">
      <img src={imageUrl(book.image)} alt={book.title} />
      <div className="book-card-body">
        <h3>{book.title}</h3>
        <p className="muted">by {book.author}</p>
        <p className="price">{formatPrice(book.price)}</p>
        <span className="badge">{book.condition}</span>
        <p className="seller-line">
          {book.seller.username} &middot; {book.seller.salesCount} {book.seller.salesCount === 1 ? 'sale' : 'sales'} completed
        </p>
      </div>
    </Link>
  );
}
