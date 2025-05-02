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
      {Array.from(
        { length: row.endSeat - row.startSeat + 1 },
        (_, index) =>
          seats[index] && (
            <SeatButton
              key={row.label + seats[index].number}
              seat={seats[index]}
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
              isGap={row.label === 'T' && seats[index].number === 19}
              onSeatSelect={() =>
                onSeatSelect(row.label, row.startSeat + index)
              }
            />
          ),
      )}
      <div
        className={`w-8 text-center font-bold text-sm ${isWing ? 'text-transparent' : ''}`}
      >
        {row.label}
      </div>
    </div>
  );
};

export default SeatRow;
