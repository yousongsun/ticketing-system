import type React from 'react';
import { Link } from 'react-router';
import './styles.css';

interface MenuProps {
  onBuyPage: boolean;
}

export const Menu: React.FC<MenuProps> = ({ onBuyPage = false }) => {
  if (!onBuyPage)
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
          <Link to="/buy" className="buy-tickets-btn">
            Buy Tickets
          </Link>
        </div>
      </header>
    );
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
      </div>
    </header>
  );
};
