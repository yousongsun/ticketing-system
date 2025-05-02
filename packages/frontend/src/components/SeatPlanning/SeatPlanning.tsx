import { useEffect, useState } from 'react';
import SeatRow from './SeatRow';
import {
  type RowArrangement,
  SEATING_ARRANGEMENT,
  type SeatData,
  mockSeatData,
} from './SeatingArrangement';

export interface Seat {
  number: number;
  available: boolean;
  selected?: boolean;
}

const SQUISH_MAGNITUDE = 10;
const SQUISH_OFFSET = 22;

export const SeatPlanning: React.FC = () => {
  const [seatData, setSeatData] = useState<SeatData>({});
  const rowXOffsets: { [key: string]: number } = {};

  for (const row of SEATING_ARRANGEMENT.middle) {
    const rowLabel = row.label;
    const startSeat = row.startSeat;
    const endSeat = row.endSeat;
    const totalSeats = endSeat - startSeat + 1;

    // The less seats in the center, the greater the offset
    const offset = (SQUISH_OFFSET - totalSeats - 1) * SQUISH_MAGNITUDE;

    rowXOffsets[rowLabel] = offset;
  }

  const onSeatSelect = (rowLabel: string, seatNumber: number) => {
    setSeatData((prev) => {
      const updatedRow = prev[rowLabel].map((seat) =>
        seat.number === seatNumber
          ? { ...seat, selected: !seat.selected }
          : seat,
      );
      return { ...prev, [rowLabel]: updatedRow };
    });
  };

  const renderWing = (
    wing: RowArrangement[],
    align: 'start' | 'center' | 'end',
  ) => (
    <div className={`flex flex-col items-${align} mb-4`}>
      {wing.map(
        (row, _) =>
          (seatData[row.label] || []).length > 0 && (
            <SeatRow
              key={align + row.label}
              row={row}
              direction={align}
              xOffset={rowXOffsets[row.label]}
              seats={seatData[row.label].filter(
                (seat) =>
                  seat.number >= row.startSeat && seat.number <= row.endSeat,
              )}
              onSeatSelect={onSeatSelect}
            />
          ),
      )}
    </div>
  );

  useEffect(() => {
    const normalizedSeatData: SeatData = Object.fromEntries(
      Object.entries(mockSeatData).map(([rowLabel, seats]) => [
        rowLabel,
        seats.map((seat) => ({ ...seat, selected: false })),
      ]),
    );
    setSeatData(normalizedSeatData);
  }, []);

  return (
    <div className="flex flex-col items-center w-full p-4">
      <div className="w-[40%] h-32 text-white bg-[#484848] rounded-t-xl flex items-center justify-center mb-10">
        <span className="text-gray-400 text-xl">Stage</span>
      </div>
      <div className="flex flex-row justify-between w-full h-full p-4 pt-16 select-none">
        {renderWing(SEATING_ARRANGEMENT.leftWing, 'end')}
        {renderWing(SEATING_ARRANGEMENT.middle, 'center')}
        {renderWing(SEATING_ARRANGEMENT.rightWing, 'start')}
      </div>
    </div>
  );
};
