import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const EditPost = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notAllowed, setNotAllowed] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        if (data.author._id !== user._id) {
          setNotAllowed(true);
        } else {
          setTitle(data.title);
          setContent(data.content);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, authLoading]);

  if (authLoading) return <p className="loading">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (loading) return <p className="loading">Loading post...</p>;
  if (notAllowed)
    return <p className="error-message">You are not authorized to edit this post.</p>;
  if (error) return <p className="error-message">{error}</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.put(`/posts/${id}`, { title, content });
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
      setSaving(false);
    }
  };

  return (
    <div className="form-page">
      <h1>Edit Post</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength="200"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(`/posts/${id}`)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
