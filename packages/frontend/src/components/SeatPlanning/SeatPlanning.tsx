import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  deselectSeat as deselectSeatAction,
  selectSeat,
} from '../../redux/slices/seatSelectionSlice';
import type { AppDispatch } from '../../redux/store';
import SeatRow from './SeatRow';
import {
  type RowArrangement,
  SEATING_ARRANGEMENT,
  type SeatData,
  mockSeatData,
} from './SeatingArrangement';

export interface Seat {
  number: number;
  rowLabel: string;
  available: boolean;
  selected?: boolean;
  seatType: 'normal' | 'vip';
}

const SQUISH_MAGNITUDE = 7;
const SQUISH_OFFSET = 24;

export const SeatPlanning: React.FC = () => {
  const [seatData, setSeatData] = useState<SeatData>({}); // Holds current seat data
  const rowXOffsets: { [key: string]: number } = {};
  const dispatch = useDispatch<AppDispatch>();

  for (const row of SEATING_ARRANGEMENT.middle) {
    const rowLabel = row.label;
    const startSeat = row.startSeat;
    const endSeat = row.endSeat;
    let totalSeats = endSeat - startSeat + 1;
    if (row.label === 'U' || row.label === 'T') {
      totalSeats += 4;
    }

    // The less seats in the center, the greater the offset
    const offset = (SQUISH_OFFSET - totalSeats - 1) * SQUISH_MAGNITUDE;

    rowXOffsets[rowLabel] = offset;
  }

  const handleSelectSeat = (seat: Seat) => {
    setSeatData((prev) => ({
      ...prev,
      [seat.rowLabel]: prev[seat.rowLabel].map((s) =>
        s.number === seat.number ? { ...s, selected: !s.selected } : s,
      ),
    }));
    dispatch(
      selectSeat({
        number: seat.number,
        rowLabel: seat.rowLabel,
        available: seat.available,
        selected: !seat.selected,
        seatType: seat.seatType,
      } as Seat),
    );
  };

  const handleDeselectSeat = (seat: Seat) => {
    setSeatData((prev) => ({
      ...prev,
      [seat.rowLabel]: prev[seat.rowLabel].map((s) =>
        s.number === seat.number ? { ...s, selected: false } : s,
      ),
    }));
    dispatch(
      deselectSeatAction({
        number: seat.number,
        rowLabel: seat.rowLabel,
        available: true,
        selected: false,
        seatType: 'normal',
      } as Seat),
    );
  };

  // Handles selecting of seats
  const onSeatSelect = (seat: Seat) => {
    if (seat.selected) {
      handleDeselectSeat(seat);
    } else {
      handleSelectSeat(seat);
    }
  };

  const renderWing = (
    wing: RowArrangement[],
    align: 'start' | 'center' | 'end',
  ) => (
    <div
      className={`flex flex-col ${align === 'start' ? 'items-start' : align === 'end' ? 'items-end' : 'items-center'}`}
    >
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
    <div className="flex flex-col items-center w-full">
      <div className="w-[32%] h-20 text-white bg-gray-700 rounded-t-xl flex items-center justify-center">
        <span className="text-gray-400 text-xl font-bold tracking-widest">
          Stage
        </span>
      </div>
      <div className="flex flex-row justify-between w-full h-full select-none mt-8">
        {renderWing(SEATING_ARRANGEMENT.leftWing, 'end')}
        {renderWing(SEATING_ARRANGEMENT.middle, 'center')}
        {renderWing(SEATING_ARRANGEMENT.rightWing, 'start')}
      </div>
    </div>
  );
};
