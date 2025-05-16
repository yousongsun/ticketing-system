import type React from 'react';
import { Sponsors } from '../components/Sponsors/Sponsors.tsx';


export const SponsorPage: React.FC = () => {
  return (
    // Title layout and sponsor images and text layout on one page
    // Layout changes depending on screen size
    <main className="min-h-screen bg-black px-4 py-10 flex flex-col items-center text-center">
      <h1 className="md:text-6xl text-3xl font-black font-[Inter] text-[#E5CE63] md:mb-10 mb-5">OUR SPONSORS FOR 2025</h1>
      <Sponsors />
    </main>
  );
};
