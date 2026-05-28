import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  const demoLogin = async () => {
    setForm({ email: 'demo@inkwell.com', password: 'demo1234' });
    setLoading(true);
    try {
      const user = await login('demo@inkwell.com', 'demo1234');
      toast.success(`Welcome, ${user.name}!`);
      navigate('/');
    } catch { setError('Demo account unavailable. Please register.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <div className="auth-brand">✦ Inkwell</div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to continue writing</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
          <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
          <Button type="submit" fullWidth loading={loading} style={{ marginTop: 4 }}>Sign In</Button>
        </form>

        <div className="auth-divider">or</div>
        <Button variant="ghost" fullWidth onClick={demoLogin} disabled={loading}>Try Demo Account</Button>
        <p className="auth-switch">Don't have an account? <Link to="/register">Join free</Link></p>
      </div>
    </div>
  );
};

export default Login;
