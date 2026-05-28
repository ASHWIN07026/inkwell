import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { CATEGORIES } from '../utils/helpers';
import { Input, Textarea, Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import './WritePost.css';

const WritePost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const textareaRef = useRef(null);

  const [form, setForm] = useState({ title: '', content: '', category: 'Technology', tags: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (!isEditing) return;
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        const p = data.data;
        setForm({ title: p.title, content: p.content, category: p.category, tags: p.tags?.join(', ') || '' });
      } catch { toast.error('Failed to load post'); navigate('/'); }
      finally { setLoading(false); }
    };
    fetchPost();
  }, [id, isEditing, navigate]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const insertMd = (before, after = '') => {
    const ta = textareaRef.current;
    const s = ta.selectionStart, e = ta.selectionEnd;
    const sel = form.content.substring(s, e);
    const next = form.content.substring(0, s) + before + sel + after + form.content.substring(e);
    setForm((f) => ({ ...f, content: next }));
    setTimeout(() => { ta.focus(); ta.selectionStart = s + before.length; ta.selectionEnd = s + before.length + sel.length; }, 0);
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim() || form.title.length < 5) errs.title = 'Title must be at least 5 characters';
    if (!form.content.trim() || form.content.length < 20) errs.content = 'Content must be at least 20 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(), content: form.content.trim(),
        category: form.category,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      if (isEditing) {
        await api.put(`/posts/${id}`, payload);
        toast.success('Post updated!');
        navigate(`/post/${id}`);
      } else {
        const { data } = await api.post('/posts', payload);
        toast.success('Post published!');
        navigate(`/post/${data.data._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save post');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="spinner" style={{ margin: '6rem auto' }} />;

  return (
    <div className="write-page container fade-in">
      <div className="write-inner">
        <div className="write-header">
          <button className="back-link" onClick={() => navigate(-1)}>← Cancel</button>
          <h1 className="write-title">{isEditing ? 'Edit Story' : 'Write a New Story'}</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Input label="Title" placeholder="Your story begins here..." value={form.title} onChange={set('title')} error={errors.title} />
          <Select label="Category" value={form.category} onChange={set('category')}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>

          <div className="editor-wrap">
            <label className="form-label" style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink2)', marginBottom: 4, display: 'block' }}>Content</label>
            <div className="toolbar">
              <button type="button" className="tb-btn" title="Bold" onClick={() => insertMd('**', '**')}><b>B</b></button>
              <button type="button" className="tb-btn" title="Italic" onClick={() => insertMd('*', '*')}><i>I</i></button>
              <button type="button" className="tb-btn" title="Heading" onClick={() => insertMd('\n## ', '')}>H2</button>
              <button type="button" className="tb-btn" title="Blockquote" onClick={() => insertMd('\n> ', '')}>❝</button>
              <button type="button" className="tb-btn" title="List item" onClick={() => insertMd('\n- ', '')}>• List</button>
              <span className="tb-divider" />
              <span className="tb-hint">Supports Markdown</span>
            </div>
            <textarea
              ref={textareaRef}
              className={`editor-textarea ${errors.content ? 'editor-error' : ''}`}
              placeholder="Tell your story..."
              value={form.content}
              onChange={set('content')}
              rows={18}
            />
            {errors.content && <p className="form-error">{errors.content}</p>}
          </div>

          <Input label="Tags (comma-separated)" placeholder="e.g. javascript, react, webdev" value={form.tags} onChange={set('tags')} />

          <div className="write-actions">
            <Button type="submit" loading={saving}>{isEditing ? 'Save Changes' : 'Publish Story'}</Button>
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Discard</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WritePost;
