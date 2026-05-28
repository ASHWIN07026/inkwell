const { validationResult } = require('express-validator');
const supabase = require('../config/supabase');

// GET /api/posts/:postId/comments
exports.getComments = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(`*, author:users!comments_author_id_fkey(id, name, email, avatar)`)
      .eq('post_id', req.params.postId)
      .is('parent_comment', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const comments = (data || []).map((c) => ({
      ...c, _id: c.id,
      author: { _id: c.author?.id, name: c.author?.name, email: c.author?.email, avatar: c.author?.avatar },
      createdAt: c.created_at,
    }));

    res.json({ success: true, data: comments });
  } catch (err) { next(err); }
};

// POST /api/posts/:postId/comments
exports.addComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { data: post } = await supabase.from('posts').select('id').eq('id', req.params.postId).single();
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

    const { data: comment, error } = await supabase
      .from('comments')
      .insert({ content: req.body.content, post_id: req.params.postId, author_id: req.user.id, parent_comment: req.body.parentComment || null })
      .select(`*, author:users!comments_author_id_fkey(id, name, email, avatar)`)
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data: {
      ...comment, _id: comment.id,
      author: { _id: comment.author?.id, name: comment.author?.name, email: comment.author?.email },
      createdAt: comment.created_at,
    }});
  } catch (err) { next(err); }
};

// DELETE /api/comments/:id
exports.deleteComment = async (req, res, next) => {
  try {
    const { data: comment } = await supabase.from('comments').select('author_id').eq('id', req.params.id).single();
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found.' });
    if (comment.author_id !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized.' });

    await supabase.from('comments').delete().eq('id', req.params.id);
    res.json({ success: true, message: 'Comment deleted.' });
  } catch (err) { next(err); }
};

// PUT /api/comments/:id/like
exports.toggleLike = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    const { data: existing } = await supabase
      .from('comment_likes').select('*').eq('comment_id', commentId).eq('user_id', userId).single();

    if (existing) {
      await supabase.from('comment_likes').delete().eq('comment_id', commentId).eq('user_id', userId);
    } else {
      await supabase.from('comment_likes').insert({ comment_id: commentId, user_id: userId });
    }

    const { count } = await supabase.from('comment_likes').select('*', { count: 'exact', head: true }).eq('comment_id', commentId);
    res.json({ success: true, liked: !existing, likesCount: count || 0 });
  } catch (err) { next(err); }
};
