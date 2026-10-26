import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getError } from '../utils.js';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // One function updates whichever field the user is typing in
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(getError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <h1>Create an account</h1>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input name="username" value={form.username} onChange={handleChange} required />

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />

        <label>Phone number</label>
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 90000 00000" required />
        <small className="muted">Shown only to a buyer after you both agree on a price.</small>

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} minLength={6} required />
        <small className="muted">At least 6 characters.</small>

        {error && <p className="error">{error}</p>}
        <button className="btn full" type="submit" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
      <p className="muted center">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
