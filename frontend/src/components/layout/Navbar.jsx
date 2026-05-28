import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">✦ Inkwell</Link>

        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/write" className="btn btn-primary btn-sm">+ Write</Link>
              <div className="user-menu-wrap">
                <div onClick={() => setMenuOpen(!menuOpen)} style={{ cursor: 'pointer' }}>
                  <Avatar name={user.name} size={34} />
                </div>
                {menuOpen && (
                  <div className="user-menu">
                    <div className="user-menu-header">
                      <span className="user-menu-name">{user.name}</span>
                      <span className="user-menu-email">{user.email}</span>
                    </div>
                    <Link to={`/profile/${user._id}`} className="user-menu-item" onClick={() => setMenuOpen(false)}>My Profile</Link>
                    <Link to="/settings" className="user-menu-item" onClick={() => setMenuOpen(false)}>Settings</Link>
                    <div className="user-menu-divider" />
                    <button className="user-menu-item user-menu-logout" onClick={handleLogout}>Sign out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Join free</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
