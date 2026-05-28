import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { CATEGORIES } from '../utils/helpers';
import PostCard from '../components/posts/PostCard';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 9 };
        if (category !== 'all') params.category = category;
        if (search) params.search = search;
        const { data } = await api.get('/posts', { params });
        setPosts(data.data);
        setPagination(data.pagination);
      } catch {
        toast.error('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [category, search, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    setPage(1);
    setSearch('');
    setSearchInput('');
  };

  return (
    <div className="home-page">
      {/* Hero */}
      <div className="home-hero">
        <h1 className="home-hero-title">Stories worth reading.</h1>
        <p className="home-hero-sub">Ideas, perspectives, and craft from writers around the world.</p>
        {!user && (
          <div className="home-hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg">Start writing free</Link>
            <Link to="/login" className="btn btn-ghost btn-lg">Sign in</Link>
          </div>
        )}
      </div>

      <div className="home-content container">
        {/* Search */}
        <form className="search-form" onSubmit={handleSearch}>
          <input
            className="search-input"
            type="text"
            placeholder="Search stories..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button className="search-btn" type="submit">Search</button>
        </form>

        {/* Category filter */}
        <div className="category-filter">
          <button
            className={`pill ${category === 'all' ? 'pill-active' : ''}`}
            onClick={() => handleCategory('all')}
          >All</button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`pill ${category === cat ? 'pill-active' : ''}`}
              onClick={() => handleCategory(cat)}
            >{cat}</button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <div className="spinner" style={{ margin: '4rem auto' }} />
        ) : posts.length === 0 ? (
          <div className="home-empty">
            <span style={{ fontSize: 40 }}>✦</span>
            <p>{search ? `No results for "${search}"` : 'No stories in this category yet.'}</p>
            {user && <Link to="/write" className="btn btn-primary" style={{ marginTop: '1rem' }}>Write the first one</Link>}
          </div>
        ) : (
          <>
            <div className="posts-grid">
              {posts.map((post) => <PostCard key={post._id} post={post} />)}
            </div>
            {pagination && pagination.pages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >← Previous</button>
                <span className="pagination-info">Page {page} of {pagination.pages}</span>
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={page === pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                >Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
