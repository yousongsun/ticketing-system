import type React from 'react';
import type { Seat } from './SeatPlanning';

interface SeatButtonProps {
  seat: Seat;
  yOffset?: number;
  isGap?: boolean;
  onSeatSelect: () => void;
}

const SeatButton: React.FC<SeatButtonProps> = ({
  seat,
  onSeatSelect,
  yOffset,
  isGap = false,
}) => {
  if (isGap) {
    return (
      <div
        className="w-14 h-4 bg-transparent"
        style={{ transform: yOffset ? `translateY(${yOffset}px)` : undefined }}
      />
    );
  }

  const selectedClass = seat.selected
    ? 'bg-transparent border-2 border-red-500'
    : 'bg-transparent border-2 border-white';
  const availableClass = seat.available
    ? 'cursor-pointer'
    : 'cursor-not-allowed !bg-red-400 border-none';

  const handleOnHover = (e: React.MouseEvent | React.FocusEvent) => {
    const button = e.target as HTMLButtonElement;
    button.textContent = seat.number.toString();
  };
  const handleHoverEnd = (e: React.MouseEvent | React.FocusEvent) => {
    const button = e.target as HTMLButtonElement;
    button.textContent = seat.selected ? seat.number.toString() : '';
  };
  return (
    <button
      type="button"
      disabled={!seat.available}
      onClick={() => onSeatSelect()}
      onFocus={(e) => handleOnHover(e)}
      onBlur={(e) => handleHoverEnd(e)}
      onMouseOver={(e) => handleOnHover(e)}
      onMouseOut={(e) => handleHoverEnd(e)}
      style={{ transform: yOffset ? `translateY(${yOffset}px)` : undefined }}
      className={`w-4 h-4 text-[8px] rounded-full transition-all duration-200 ${selectedClass} ${availableClass}`}
    >
      {' '}
    </button>
  );
};

export default SeatButton;
