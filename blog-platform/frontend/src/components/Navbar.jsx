import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        MyBlog
      </Link>
      <div className="navbar-links">
        <Link to="/">Posts</Link>
        {user ? (
          <>
            <Link to="/posts/new" className="btn btn-primary btn-sm">
              New Post
            </Link>
            <span className="navbar-user">Hi, {user.username}</span>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
