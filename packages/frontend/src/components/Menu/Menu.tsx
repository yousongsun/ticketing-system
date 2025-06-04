import { Link, useLocation } from 'react-router';

export const Menu: React.FC = () => {
  const location = useLocation();
  return (
    <header className="relative flex justify-between items-center h-20 w-full px-5 z-10 bg-[#1a1a1a]">
      <Link
        to="/"
        className="font-poppins font-bold text-2xl leading-[42px] text-[#f2f2f2] no-underline"
      >
        MedRevue
      </Link>
      <div className="flex gap-20 items-center">
        <Link
          to="/"
          className="font-inter text-2xl font-normal leading-[36px] text-[#cccccc] no-underline transition-colors duration-300 hover:text-[#e5ce63]"
        >
          Home
        </Link>
        <Link
          to="/show"
          className="font-inter text-2xl font-normal leading-[36px] text-[#cccccc] no-underline transition-colors duration-300 hover:text-[#e5ce63]"
        >
          2025 Show
        </Link>
        <Link
          to="/sponsors"
          className="font-inter text-2xl font-normal leading-[36px] text-[#cccccc] no-underline transition-colors duration-300 hover:text-[#e5ce63]"
        >
          Sponsors
        </Link>
        <a
          href="https://msf.org.nz/donatenow?src=www.medrevue.co.nz"
          target="_blank"
          rel="noopener noreferrer"
          className="font-inter text-2xl font-normal leading-[36px] text-[#cccccc] no-underline transition-colors duration-300 hover:text-[#e5ce63]"
        >
          Donate
        </a>
        {/* <Link
          to="/gallery"
          className="font-inter text-2xl font-normal leading-[36px] text-[#cccccc] no-underline transition-colors duration-300 hover:text-[#e5ce63]"
        >
          Gallery
        </Link> */}
        {/* <Link
          to="/about"
          className="font-inter text-2xl font-normal leading-[36px] text-[#cccccc] no-underline transition-colors duration-300 hover:text-[#e5ce63]"
        >
          About
        </Link> */}
        {location.pathname !== '/buy' && (
          <Link
            to="/buy"
            className="bg-[#e5ce63] rounded-lg py-[10px] px-6 font-inter text-2xl font-normal leading-[36px] text-[#1a1a1a] no-underline transition-colors duration-300 hover:bg-[#fff0a2]"
          >
            Buy Tickets
          </Link>
        )}
      </div>
    </header>
  );
};
