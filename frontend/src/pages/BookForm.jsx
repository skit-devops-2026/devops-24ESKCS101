import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getError, imageUrl } from '../utils.js';

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

// This one page is used both for "Sell a Book" (/sell) and "Edit Book" (/books/:id/edit)
export default function BookForm() {
  const { id } = useParams(); // exists only when editing
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', author: '', price: '', condition: 'Good', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  // When editing, load the current book details into the form
  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/books/${id}`)
      .then((res) => {
        const book = res.data;
        if (String(book.seller._id) !== String(user.id)) {
          setError('You can only edit your own listings.');
          return;
        }
        if (book.status === 'sold') {
          setError('A sold book cannot be edited.');
          return;
        }
        setForm({
          title: book.title,
          author: book.author,
          price: book.price,
          condition: book.condition,
          description: book.description || '',
        });
        setPreview(imageUrl(book.image));
      })
      .catch((err) => setError(getError(err)))
      .finally(() => setLoading(false));
  }, [id, isEdit, user.id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file)); // show the chosen picture right away
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isEdit && !imageFile) {
      setError('Please choose a picture of the book.');
      return;
    }

    // Files must be sent as FormData (not plain JSON)
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (imageFile) data.append('image', imageFile);

    setSubmitting(true);
    try {
      const res = isEdit ? await api.put(`/books/${id}`, data) : await api.post('/books', data);
      navigate(`/books/${res.data._id}`);
    } catch (err) {
      setError(getError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="notice">Loading...</p>;

  return (
    <div className="form-card wide">
      <h1>{isEdit ? 'Edit your listing' : 'Sell a book'}</h1>
      <form onSubmit={handleSubmit}>
        <label>Title *</label>
        <input name="title" value={form.title} onChange={handleChange} required />

        <label>Author *</label>
        <input name="author" value={form.author} onChange={handleChange} required />

        <label>Asking price (₹) *</label>
        <input name="price" type="number" min="1" value={form.price} onChange={handleChange} required />

        <label>Condition</label>
        <select name="condition" value={form.condition} onChange={handleChange}>
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label>Description (optional)</label>
        <textarea name="description" rows="4" value={form.description} onChange={handleChange} />

        <label>Picture {isEdit ? '(choose a new one only if you want to replace it)' : '*'}</label>
        <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleImage} />
        <small className="muted">JPG, PNG or WEBP, up to 3 MB.</small>
        {preview && <img className="preview" src={preview} alt="Preview" />}

        {error && <p className="error">{error}</p>}
        <button className="btn full" type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : isEdit ? 'Save changes' : 'Post book'}
        </button>
      </form>
    </div>
  );
}
