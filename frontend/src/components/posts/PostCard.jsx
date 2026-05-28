import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, truncate } from '../../utils/helpers';
import Avatar from '../ui/Avatar';
import CategoryBadge from '../ui/CategoryBadge';
import './PostCard.css';

const PostCard = ({ post }) => {
  const excerpt = post.excerpt || truncate(post.content?.replace(/[#*>`_\n]/g, ' '), 160);
  return (
    <article className="post-card fade-in">
      <Link to={`/post/${post._id}`} className="post-card-link">
        <div className="post-card-inner">
          <CategoryBadge category={post.category} />
          <h3 className="post-card-title">{post.title}</h3>
          <p className="post-card-excerpt">{excerpt}</p>
          <div className="post-card-meta">
            <Avatar name={post.author?.name} size={26} />
            <span className="post-card-author">{post.author?.name}</span>
            <span className="post-card-dot">·</span>
            <span className="post-card-date">{formatDate(post.createdAt)}</span>
            <span className="post-card-stats">
              <span>❤ {post.likes?.length || 0}</span>
              <span>💬 {post.commentCount || 0}</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default PostCard;
