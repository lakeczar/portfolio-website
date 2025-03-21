import { Link } from '@tanstack/react-router';
import ThemeToggle from '../theme-toggle/ThemeToggle';

const Navigation = () => {
  return (
    <nav className="p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-xl font-bold">Alek Racz Portfolio</div>
        <div className="flex gap-4">
          <Link to="/" className="hover:text-blue-600 [&.active]:font-bold">
            Home
          </Link>
          <Link
            to="/about"
            className="hover:text-blue-600 [&.active]:font-bold"
          >
            About
          </Link>
          <Link
            to="/timeline"
            className="hover:text-blue-600 [&.active]:font-bold"
          >
            Timeline
          </Link>
        </div>
      </div>
      <ThemeToggle />
    </nav>
  );
};

export default Navigation;
