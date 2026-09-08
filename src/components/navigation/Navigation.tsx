import { Link } from '@tanstack/react-router';

const Navigation = () => {
  return (
    <nav className="site-navigation" aria-label="Primary navigation">
      <Link to="/" className="site-wordmark" aria-label="Alek Racz home">
        Alek Racz
      </Link>
      <div className="site-navigation-links">
        <Link to="/" className="site-navigation-link">
          Home
        </Link>
        <Link to="/about" className="site-navigation-link">
          About
        </Link>
        <Link to="/timeline" className="site-navigation-link">
          Timeline
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
