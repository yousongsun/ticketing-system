import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type {
  Seat,
  SeatData,
} from '../../components/SeatPlanning/SeatPlanning';

interface SeatSelectionState {
  seatData: SeatData;
}

const initialState: SeatSelectionState = {
  seatData: {},
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
      state.seatData[rowLabel] = state.seatData[rowLabel].map((seat) =>
        seat.number === number ? { ...seat, selected: !seat.selected } : seat,
      );
    },
  },
});

export const { initializeSeatData, toggleSeatSelection } =
  seatSelectionSlice.actions;
export default seatSelectionSlice.reducer;
