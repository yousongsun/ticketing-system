import { cn } from '@/lib/utils';
import type React from 'react';
import { Link } from 'react-router';
import { Button } from '../Button'
import './styles.css';

interface MenuProps {
  onBuyPage: boolean;
}

export const Menu: React.FC<MenuProps> = ({
  onBuyPage = false
}) => {
  if (!onBuyPage)
    return (
      <header className="navbar">
        <Link to="/">
          <a className="logo">MedRevue</a>
        </Link>
        <div className="nav-links">
          <Link to="/">
            <a className="nav-link">Home</a>
          </Link>
          <Link to="/show">
            <a className="nav-link">Show</a>
          </Link>
          <Link to="/gallery">
            <a className="nav-link">Gallery</a>
          </Link>
          <Link to="/about">
            <a className="nav-link">About</a>
          </Link>
          <Link to="/buy">
            <a className="buy-tickets-btn">Buy Tickets</a>
          </Link>
        </div>
      </header>
    );
  else
    return (
      <header className="navbar">
        <Link to="/">
          <a className="logo">MedRevue</a>
        </Link>
        <div className="nav-links">
          <Link to="/">
            <a className="nav-link">Home</a>
          </Link>
          <Link to="/show">
            <a className="nav-link">Show</a>
          </Link>
          <Link to="/gallery">
            <a className="nav-link">Gallery</a>
          </Link>
          <Link to="/about">
            <a className="nav-link">About</a>
          </Link>
        </div>
      </header>
    );
};