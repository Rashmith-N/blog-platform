import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post');
    }
  };

  if (loading) return <p className="loading">Loading post...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!post) return null;

  const isAuthor = user && post.author && user._id === post.author._id;

  return (
    <div>
      <article className="post-detail">
        <h1>{post.title}</h1>
        <p className="post-meta">
          By <strong>{post.author?.username || 'Unknown'}</strong> on{' '}
          {new Date(post.createdAt).toLocaleString()}
        </p>
        <div className="post-content">{post.content}</div>

        {isAuthor && (
          <div className="post-actions">
            <Link to={`/posts/${post._id}/edit`} className="btn btn-primary">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              Delete
            </button>
          </div>
        )}
      </article>

      <CommentSection postId={post._id} postAuthorId={post.author?._id} />
    </div>
  );
};

export default PostDetail;
