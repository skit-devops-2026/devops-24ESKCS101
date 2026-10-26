import { useEffect, useState } from 'react';
import api from '../api.js';
import BookCard from '../components/BookCard.jsx';
import { getError } from '../utils.js';

export default function Browse() {
  const [books, setBooks] = useState([]);
  const [searchText, setSearchText] = useState(''); // what the user is typing
  const [activeSearch, setActiveSearch] = useState(''); // what was actually searched
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load books whenever the active search changes
  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get('/books', { params: { search: activeSearch } })
      .then((res) => setBooks(res.data))
      .catch((err) => setError(getError(err)))
      .finally(() => setLoading(false));
  }, [activeSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveSearch(searchText.trim());
  };

  const clearSearch = () => {
    setSearchText('');
    setActiveSearch('');
  };

  return (
    <>
      <h1>Browse Books</h1>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className="btn" type="submit">Search</button>
        {activeSearch && (
          <button className="btn btn-outline" type="button" onClick={clearSearch}>Clear</button>
        )}
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p className="notice">Loading books...</p>}

      {!loading && !error && books.length === 0 && (
        <p className="notice">No books found{activeSearch ? ` for "${activeSearch}"` : ''}.</p>
      )}

      <div className="book-grid">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </>
  );
}
