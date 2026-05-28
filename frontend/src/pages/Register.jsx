import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import './Auth.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password);
      toast.success(`Welcome to Inkwell, ${user.name}!`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <div className="auth-brand">✦ Inkwell</div>
        <h1 className="auth-title">Start writing</h1>
        <p className="auth-sub">Create your Inkwell account</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <Input label="Full Name" type="text" placeholder="Jane Doe" value={form.name} onChange={set('name')} required />
          <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
          <Input label="Password" type="password" placeholder="min 6 characters" value={form.password} onChange={set('password')} required />
          <Button type="submit" fullWidth loading={loading} style={{ marginTop: 4 }}>Create Account</Button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
};

export default Register;
