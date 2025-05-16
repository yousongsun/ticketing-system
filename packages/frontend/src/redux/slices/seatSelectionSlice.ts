import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { Seat } from '../../components/SeatPlanning/SeatPlanning';

interface SeatSelectionState {
  selectedSeats: Seat[];
}

const initialState: SeatSelectionState = {
  selectedSeats: [],
};

const seatSelectionSlice = createSlice({
  name: 'seatSelection',
  initialState,
  reducers: {
    selectSeat: (state, action: PayloadAction<Seat>) => {
      state.selectedSeats.push(action.payload);
    },
    deselectSeat: (state, action: PayloadAction<Seat>) => {
      state.selectedSeats = state.selectedSeats.filter(
        (seat) =>
          seat.rowLabel !== action.payload.rowLabel ||
          seat.number !== action.payload.number,
      );
    },
  },
});

export const { selectSeat, deselectSeat } = seatSelectionSlice.actions;

export default seatSelectionSlice.reducer;
