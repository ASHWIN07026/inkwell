import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import PostCard from '../components/posts/PostCard';
import './Profile.css';

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get(`/users/${id}/posts`),
        ]);
        setProfile(userRes.data.data);
        setPosts(postsRes.data.data);
      } catch { toast.error('Failed to load profile'); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div className="spinner" style={{ margin: '6rem auto' }} />;
  if (!profile) return <div className="container" style={{ padding: '3rem 1.5rem', color: 'var(--ink3)' }}>User not found.</div>;

  const totalLikes = posts.reduce((acc, p) => acc + (p.likes?.length || 0), 0);
  const isOwn = user && user._id === id;

  return (
    <div className="profile-page container fade-in">
      <div className="profile-hero">
        <Avatar name={profile.name} size={72} />
        <div className="profile-info">
          <h1 className="profile-name">{profile.name}</h1>
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          <p className="profile-joined">Member since {formatDate(profile.createdAt)}</p>
          <div className="profile-stats">
            <div className="stat"><strong>{posts.length}</strong><span>Stories</span></div>
            <div className="stat"><strong>{totalLikes}</strong><span>Likes</span></div>
          </div>
        </div>
        {isOwn && <Link to="/settings" className="btn btn-ghost btn-sm profile-edit-btn">Edit Profile</Link>}
      </div>

      <div className="profile-posts">
        <h2 className="profile-posts-title">{isOwn ? 'Your Stories' : `Stories by ${profile.name}`}</h2>
        {posts.length === 0 ? (
          <div className="home-empty">
            <p>No stories published yet.</p>
            {isOwn && <Link to="/write" className="btn btn-primary" style={{ marginTop: '1rem' }}>Write your first story</Link>}
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
