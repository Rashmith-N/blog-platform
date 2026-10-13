import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="empty-state">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
