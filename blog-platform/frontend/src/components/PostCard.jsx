import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  return (
    <article className="post-card">
      <h2>
        <Link to={`/posts/${post._id}`}>{post.title}</Link>
      </h2>
      <p className="post-meta">
        By <strong>{post.author?.username || 'Unknown'}</strong> on{' '}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <p className="post-excerpt">
        {post.content.length > 150
          ? `${post.content.substring(0, 150)}...`
          : post.content}
      </p>
      <Link to={`/posts/${post._id}`} className="read-more">
        Read More →
      </Link>
    </article>
  );
};

export default PostCard;
