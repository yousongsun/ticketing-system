import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import seatSelectionReducer from './slices/seatSelectionSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    seatSelection: seatSelectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
