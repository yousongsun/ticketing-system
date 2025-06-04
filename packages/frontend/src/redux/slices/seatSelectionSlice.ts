import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type {
  Seat,
  SeatData,
} from '../../components/SeatPlanning/SeatPlanning';

interface SeatSelectionState {
  seatData: SeatData;
  selectedSeats: Seat[];
}

const initialState: SeatSelectionState = {
  seatData: {},
  selectedSeats: [],
};

const seatSelectionSlice = createSlice({
  name: 'seatSelection',
  initialState,
  reducers: {
    initializeSeatData: (state, action: PayloadAction<SeatData>) => {
      state.seatData = action.payload;
    },
    toggleSeatSelection: (state, action: PayloadAction<Seat>) => {
      const { rowLabel, number } = action.payload;
      const seat = state.seatData[rowLabel].find((s) => s.number === number);

      if (seat) {
        // Toggle the selected state in seatData
        state.seatData[rowLabel] = state.seatData[rowLabel].map((s) =>
          s.number === number ? { ...s, selected: !s.selected } : s,
        );

        // Update selectedSeats array
        const seatIndex = state.selectedSeats.findIndex(
          (s) => s.rowLabel === rowLabel && s.number === number,
        );

        if (seatIndex === -1) {
          // Add to selectedSeats if not present
          state.selectedSeats.push({ ...seat, selected: true });
        } else {
          // Remove from selectedSeats if already present
          state.selectedSeats.splice(seatIndex, 1);
        }
      }
    },
    clearSelectedSeats: (state) => {
      // Clear all selected seats
      state.selectedSeats = [];
      // Reset selected state in seatData
      for (const rowLabel of Object.keys(state.seatData)) {
        state.seatData[rowLabel] = state.seatData[rowLabel].map((seat) => ({
          ...seat,
          selected: false,
        }));
      }
    },
  },
});

// Selectors
export const selectSelectedSeats = (state: {
  seatSelection: SeatSelectionState;
}) => state.seatSelection.selectedSeats;

export const { initializeSeatData, toggleSeatSelection, clearSelectedSeats } =
  seatSelectionSlice.actions;
export default seatSelectionSlice.reducer;
