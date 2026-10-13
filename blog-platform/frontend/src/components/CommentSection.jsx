import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ postId, postAuthorId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await api.get(`/posts/${postId}/comments`);
        setComments(data);
      } catch (err) {
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post(`/posts/${postId}/comments`, { content });
      setComments((prev) => [...prev, data]);
      setContent('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    setError('');
    try {
      await api.delete(`/posts/${postId}/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  return (
    <section className="comment-section">
      <h2>Comments ({comments.length})</h2>

      {error && <p className="error-message">{error}</p>}

      {user ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            required
          />
          <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p className="comment-login-notice">Please log in to leave a comment.</p>
      )}

      {loading ? (
        <p className="loading">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="empty-state">No comments yet. Start the conversation!</p>
      ) : (
        <div className="comment-list">
          {comments.map((comment) => {
            const canDelete =
              user &&
              (user._id === comment.author?._id || user._id === postAuthorId);
            return (
              <div key={comment._id} className="comment-item">
                <div className="comment-header">
                  <div>
                    <span className="comment-author">
                      {comment.author?.username || 'Unknown'}
                    </span>{' '}
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {canDelete && (
                    <button
                      className="comment-delete-btn"
                      onClick={() => handleDelete(comment._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="comment-content">{comment.content}</p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CommentSection;
