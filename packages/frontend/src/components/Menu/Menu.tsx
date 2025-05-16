import { Link, useLocation } from 'react-router';
import './styles.css';

export const Menu: React.FC = () => {
  const location = useLocation();
  return (
    <header className="navbar">
      <Link to="/" className="logo">
        MedRevue
      </Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/show" className="nav-link">
          Show
        </Link>
        <Link to="/gallery" className="nav-link">
          Gallery
        </Link>
        <Link to="/about" className="nav-link">
          About
        </Link>
        {location.pathname !== '/buy' && (
          <Link to="/buy" className="buy-tickets-btn">
            Buy Tickets
          </Link>
        )}
      </div>
    </header>
  );
};
