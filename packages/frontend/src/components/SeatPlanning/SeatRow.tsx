import SeatButton from './SeatButton';
import type { Seat } from './SeatPlanning';
import type { RowArrangement } from './SeatingArrangement';

interface SeatRowProps {
  row: RowArrangement;
  seats: Seat[];
  direction?: 'start' | 'center' | 'end';
  xOffset?: number;
  onSeatSelect: (rowLabel: string, seatNumber: number) => void;
}

const ANGLE_OFFSET = 70;

const SeatRow: React.FC<SeatRowProps> = ({
  row,
  seats,
  direction,
  xOffset = 0,
  onSeatSelect,
}) => {
  const isWing = direction === 'start' || direction === 'end';
  return (
    <div
      className="flex h-10 gap-x-[4px] text-white"
      style={{
        transform: `translateX(${direction === 'start' ? -xOffset : direction === 'end' ? xOffset : 0}px)`,
      }}
    >
      <div
        className={`w-8 text-center font-bold text-sm ${isWing ? 'text-transparent' : ''}`}
      >
        {row.label}
      </div>
      {Array.from({ length: row.endSeat - row.startSeat + 1 }, (_, index) => {
        const reversedIndex = seats.length - 1 - index;
        const seat = seats[reversedIndex];
        return (
          seat && (
            <SeatButton
              key={row.label + seat.number}
              seat={seat}
              yOffset={
                direction === 'start'
                  ? -(
                      (ANGLE_OFFSET * index) /
                      (Math.max(row.endSeat - row.startSeat + 1, 12) * 1)
                    )
                  : direction === 'end'
                    ? (ANGLE_OFFSET * (index - (row.endSeat - row.startSeat))) /
                      (Math.max(row.endSeat - row.startSeat + 1, 12) * 1)
                    : 0
              }
              isGap={
                (row.label === 'T' || row.label === 'U') &&
                (seat.number === 20 || seat.number === 21)
              }
              onSeatSelect={() =>
                onSeatSelect(row.label, row.startSeat + index)
              }
            />
          )
        );
      })}
      <div
        className={`w-8 text-center font-bold text-sm ${isWing ? 'text-transparent' : ''}`}
      >
        {row.label}
      </div>
    </div>
  );
};

export default SeatRow;
