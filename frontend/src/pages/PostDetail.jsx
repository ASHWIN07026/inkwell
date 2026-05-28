import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { formatDate, parseMarkdown } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import CategoryBadge from '../components/ui/CategoryBadge';
import CommentSection from '../components/comments/CommentSection';
import Button from '../components/ui/Button';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data.data);
        setLikesCount(data.data.likes?.length || 0);
        if (user) setLiked(data.data.likes?.includes(user._id));
      } catch {
        toast.error('Post not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, user, navigate]);

  const handleLike = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      const { data } = await api.put(`/posts/${id}/like`);
      setLiked(data.liked);
      setLikesCount(data.likesCount);
    } catch { toast.error('Failed to update like'); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/posts/${id}`);
      toast.success('Post deleted');
      navigate('/');
    } catch { toast.error('Failed to delete post'); setDeleting(false); }
  };

  if (loading) return <div className="spinner" style={{ margin: '6rem auto' }} />;
  if (!post) return null;

  const isOwner = user && user._id === post.author?._id;

  return (
    <div className="post-detail-page container fade-in">
      <div className="post-detail-inner">
        <Link to="/" className="back-link">← Back to stories</Link>

        <article className="post-article">
          <CategoryBadge category={post.category} />
          <h1 className="post-title">{post.title}</h1>

          <div className="post-byline">
            <Avatar name={post.author?.name} size={40} />
            <div>
              <Link to={`/profile/${post.author?._id}`} className="post-author-name">{post.author?.name}</Link>
              {post.author?.bio && <p className="post-author-bio">{post.author.bio}</p>}
            </div>
            <div className="post-meta-right">
              <span>{formatDate(post.createdAt)}</span>
              <span>· {post.views} views</span>
            </div>
          </div>

          <div
            className="post-body"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }}
          />

          <div className="post-actions-bar">
            <button className={`like-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
              ❤ {liked ? 'Liked' : 'Like'} ({likesCount})
            </button>
            {isOwner && (
              <div className="owner-actions">
                <Button variant="ghost" size="sm" onClick={() => navigate(`/write/${post._id}`)}>Edit</Button>
                {!confirmDelete ? (
                  <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>Delete</Button>
                ) : (
                  <div className="delete-confirm">
                    <span>Are you sure?</span>
                    <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete}>Yes, delete</Button>
                    <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {post.tags?.length > 0 && (
            <div className="post-tags">
              {post.tags.map((tag) => <span key={tag} className="post-tag">#{tag}</span>)}
            </div>
          )}
        </article>

        <CommentSection postId={id} />
      </div>
    </div>
  );
};

export default PostDetail;
