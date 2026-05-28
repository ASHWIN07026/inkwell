import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Input, Textarea } from '../components/ui/Input';
import Button from '../components/ui/Button';
import './Settings.css';

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const setP = (key) => (e) => setProfile((f) => ({ ...f, [key]: e.target.value }));
  const setPw = (key) => (e) => setPasswords((f) => ({ ...f, [key]: e.target.value }));

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', { name: profile.name, bio: profile.bio });
      updateUser({ ...user, ...data.data });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (passwords.newPassword.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    setChangingPw(true);
    try {
      await api.put('/users/password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password updated! Please sign in again.');
      logout();
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally { setChangingPw(false); }
  };

  return (
    <div className="settings-page container fade-in">
      <div className="settings-inner">
        <h1 className="settings-title">Settings</h1>

        <section className="settings-section">
          <h2 className="settings-section-title">Profile</h2>
          <form onSubmit={handleProfileSave}>
            <Input label="Full Name" value={profile.name} onChange={setP('name')} required />
            <Input label="Email" value={user?.email || ''} disabled style={{ opacity: 0.6 }} />
            <Textarea label="Bio" placeholder="Tell readers about yourself..." value={profile.bio} onChange={setP('bio')} style={{ minHeight: 80 }} />
            <Button type="submit" loading={saving}>Save Profile</Button>
          </form>
        </section>

        <section className="settings-section">
          <h2 className="settings-section-title">Change Password</h2>
          <form onSubmit={handlePasswordChange}>
            <Input label="Current Password" type="password" placeholder="••••••••" value={passwords.currentPassword} onChange={setPw('currentPassword')} required />
            <Input label="New Password" type="password" placeholder="min 6 characters" value={passwords.newPassword} onChange={setPw('newPassword')} required />
            <Input label="Confirm New Password" type="password" placeholder="••••••••" value={passwords.confirmPassword} onChange={setPw('confirmPassword')} required />
            <Button type="submit" loading={changingPw}>Update Password</Button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Settings;
