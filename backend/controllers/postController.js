const { validationResult } = require('express-validator');
const supabase = require('../config/supabase');

const withAuthor = (post, author) => ({
  ...post,
  _id: post.id,
  author: author || { _id: post.author_id, name: 'Unknown' },
  likes: post.likes || [],
  commentCount: Array.isArray(post.comment_count)
    ? (post.comment_count[0]?.count || 0)
    : (post.comment_count || 0),
  createdAt: post.created_at,
  updatedAt: post.updated_at,
});

// GET /api/posts
exports.getPosts = async (req, res, next) => {
  try {
    const { category, search, author, page = 1, limit = 9 } = req.query;
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;

    let query = supabase
      .from('posts')
      .select(`
        *,
        author:users!posts_author_id_fkey(id, name, email, avatar),
        likes:post_likes(user_id),
        comment_count:comments(count)
      `, { count: 'exact' })
      .eq('published', true)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (category && category !== 'all') query = query.eq('category', category);
    if (author) query = query.eq('author_id', author);
    if (search) query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);

    const { data, error, count } = await query;
    if (error) throw error;

    const posts = (data || []).map((p) => withAuthor(p, {
      _id: p.author?.id, name: p.author?.name, email: p.author?.email, avatar: p.author?.avatar,
    }));

    res.json({
      success: true,
      data: posts,
      pagination: {
        total: count, page: parseInt(page),
        pages: Math.ceil(count / parseInt(limit)), limit: parseInt(limit),
      },
    });
  } catch (err) { next(err); }
};

// GET /api/posts/:id
exports.getPost = async (req, res, next) => {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:users!posts_author_id_fkey(id, name, email, avatar, bio),
        likes:post_likes(user_id),
        comment_count:comments(count)
      `)
      .eq('id', req.params.id)
      .eq('published', true)
      .single();

    if (error || !post) return res.status(404).json({ success: false, message: 'Post not found.' });

    // Increment views
    await supabase.from('posts').update({ views: (post.views || 0) + 1 }).eq('id', req.params.id);

    res.json({ success: true, data: withAuthor(post, {
      _id: post.author?.id, name: post.author?.name,
      email: post.author?.email, avatar: post.author?.avatar, bio: post.author?.bio,
    })});
  } catch (err) { next(err); }
};

// POST /api/posts
exports.createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { title, content, category, tags, coverImage } = req.body;
    const excerpt = content.replace(/[#*>`_\n]/g, ' ').trim().slice(0, 200) + '...';

    const { data: post, error } = await supabase
      .from('posts')
      .insert({ title, content, excerpt, category, tags: tags || [], cover_image: coverImage || '', author_id: req.user.id })
      .select(`*, author:users!posts_author_id_fkey(id, name, email, avatar)`)
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data: withAuthor(post, {
      _id: post.author?.id, name: post.author?.name, email: post.author?.email,
    })});
  } catch (err) { next(err); }
};

// PUT /api/posts/:id
exports.updatePost = async (req, res, next) => {
  try {
    const { data: existing } = await supabase.from('posts').select('author_id').eq('id', req.params.id).single();
    if (!existing) return res.status(404).json({ success: false, message: 'Post not found.' });
    if (existing.author_id !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized.' });

    const { title, content, category, tags, coverImage, published } = req.body;
    const excerpt = content ? content.replace(/[#*>`_\n]/g, ' ').trim().slice(0, 200) + '...' : undefined;

    const updates = { title, content, category, tags, published };
    if (excerpt) updates.excerpt = excerpt;
    if (coverImage !== undefined) updates.cover_image = coverImage;

    const { data: post, error } = await supabase
      .from('posts').update(updates).eq('id', req.params.id)
      .select(`*, author:users!posts_author_id_fkey(id, name, email, avatar)`).single();

    if (error) throw error;
    res.json({ success: true, data: withAuthor(post, { _id: post.author?.id, name: post.author?.name }) });
  } catch (err) { next(err); }
};

// DELETE /api/posts/:id
exports.deletePost = async (req, res, next) => {
  try {
    const { data: existing } = await supabase.from('posts').select('author_id').eq('id', req.params.id).single();
    if (!existing) return res.status(404).json({ success: false, message: 'Post not found.' });
    if (existing.author_id !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized.' });

    const { error } = await supabase.from('posts').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Post deleted.' });
  } catch (err) { next(err); }
};

// PUT /api/posts/:id/like
exports.toggleLike = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const { data: existing } = await supabase
      .from('post_likes').select('*').eq('post_id', postId).eq('user_id', userId).single();

    if (existing) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', userId);
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: userId });
    }

    const { count } = await supabase.from('post_likes').select('*', { count: 'exact', head: true }).eq('post_id', postId);
    res.json({ success: true, liked: !existing, likesCount: count || 0 });
  } catch (err) { next(err); }
};