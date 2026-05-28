const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');

// GET /api/users/:id
exports.getUser = async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from('users').select('id, name, email, bio, avatar, created_at').eq('id', req.params.id).single();
    if (error || !user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, data: { ...user, _id: user.id, createdAt: user.created_at } });
  } catch (err) { next(err); }
};

// GET /api/users/:id/posts
exports.getUserPosts = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`*, author:users!posts_author_id_fkey(id, name, email, avatar), likes:post_likes(user_id), comment_count:comments(count)`)
      .eq('author_id', req.params.id).eq('published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const posts = (data || []).map((p) => ({
      ...p, _id: p.id,
      author: { _id: p.author?.id, name: p.author?.name, email: p.author?.email },
      likes: p.likes || [], commentCount: p.comment_count?.[0]?.count || 0,
      createdAt: p.created_at,
    }));

    res.json({ success: true, data: posts });
  } catch (err) { next(err); }
};

// PUT /api/users/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;
    const { data: user, error } = await supabase
      .from('users').update({ name, bio, avatar }).eq('id', req.user.id)
      .select('id, name, email, bio, avatar, created_at').single();
    if (error) throw error;
    res.json({ success: true, data: { ...user, _id: user.id } });
  } catch (err) { next(err); }
};

// PUT /api/users/password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { data: user } = await supabase.from('users').select('password').eq('id', req.user.id).single();

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    if (newPassword.length < 6) return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });

    const hashed = await bcrypt.hash(newPassword, 12);
    await supabase.from('users').update({ password: hashed }).eq('id', req.user.id);
    res.json({ success: true, message: 'Password updated.' });
  } catch (err) { next(err); }
};
