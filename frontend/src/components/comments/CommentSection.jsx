import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { formatRelative } from '../../utils/helpers';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import './CommentSection.css';

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await api.get(`/posts/${postId}/comments`);
        setComments(data.data);
      } catch {
        toast.error('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/posts/${postId}/comments`, { content: text.trim() });
      setComments((prev) => [data.data, ...prev]);
      setText('');
      toast.success('Comment posted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <section className="comment-section">
      <h3 className="comment-section-title">Comments ({comments.length})</h3>

      {user ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <div className="comment-form-row">
            <Avatar name={user.name} size={36} />
            <textarea
              className="comment-input"
              placeholder="Share your thoughts..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
            />
          </div>
          <div className="comment-form-actions">
            <Button type="submit" size="sm" loading={submitting} disabled={!text.trim()}>
              Post Comment
            </Button>
          </div>
        </form>
      ) : (
        <div className="comment-login-prompt">
          <Link to="/login">Sign in</Link> to leave a comment.
        </div>
      )}

      {loading ? (
        <div className="spinner" style={{ marginTop: '2rem' }} />
      ) : comments.length === 0 ? (
        <p className="comment-empty">No comments yet. Be the first to respond.</p>
      ) : (
        <div className="comment-list">
          {comments.map((c) => (
            <div key={c._id} className="comment-item">
              <Avatar name={c.author?.name} size={36} />
              <div className="comment-body">
                <div className="comment-header">
                  <span className="comment-author">{c.author?.name}</span>
                  <span className="comment-date">{formatRelative(c.createdAt)}</span>
                  {user && user._id === c.author?._id && (
                    <button className="comment-delete" onClick={() => handleDelete(c._id)}>Delete</button>
                  )}
                </div>
                <p className="comment-text">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CommentSection;
