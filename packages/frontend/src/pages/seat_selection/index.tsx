import type React from 'react';
import { useSelector } from 'react-redux';
import { SeatPlanning } from '../../components/SeatPlanning';
import type { RootState } from '../../redux/store';

const SeatSelectionPage: React.FC = () => {
  const selectedSeats = useSelector(
    (state: RootState) => state.seatSelection.selectedSeats,
  );

  return (
    <div className="relative select-none overflow-hidden overscroll-none touch-none cursor-default h-screen">
      <img
        src={'./BackgroundBlur.svg'}
        alt="decorative blur"
        className="w-full h-screen absolute top-0 left-0 pointer-events-none z-10"
        draggable="false"
      />
      <div className="relative flex flex-row items-center justify-between h-full bg-[#070507] z-1 gap-x-8 p-4">
        <div className="w-[60%] h-auto flex items-center justify-center overflow-hidden">
          <div
            className="
                      scale-45 
                      sm:scale-50 
                      md:scale-65 
                      lg:scale-88 
                      xl:scale-100
                    "
          >
            <SeatPlanning />
          </div>
        </div>
        <div className="w-[40%] h-[90%] flex  bg-[#070507] rounded-xl p-4 flex-col gap-y-4">
          <div>
            <h2
              className="text-[#FFF0A2] font-bold text-md text-right tracking-wide
"
            >
              7th August | 05:00 - 06:30 pm
            </h2>
            <h1
              className="text-[#E5CE63] font-black text-xl text-right tracking-widest
"
            >
              BACK TO THE SUTURE
            </h1>
          </div>
          {selectedSeats.length > 0 ? (
            <div className="text-white text-lg w-full">
              <h2 className="text-lg font-bold mb-4">Selected Seats:</h2>
              <ul className="list-inside w-full">
                {selectedSeats.map((seat) => (
                  <li
                    key={seat.number}
                    className="text-lg text-white border-white border-3 w-full px-4 py-2 rounded-lg mb-2"
                  >
                    Row: {seat.rowLabel} | Number: {seat.number} | Type:{' '}
                    {seat.seatType.charAt(0).toUpperCase() +
                      seat.seatType.slice(1)}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <span className="text-white text-lg font-bold">
              Select your seats
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
export default SeatSelectionPage;
