// Yellow: #E5CE63
// Light Yellow: #FFF0A2
// White: #FFFBE8
// Font: Inter & Poppins

import type React from 'react';

import medworldLogo from '../../assets/medworld.png';
import mpsLogo from '../../assets/mps.png';
import pizzaclubLogo from '../../assets/pizza-club.png';
import respmedLogo from '../../assets/respmed.png';
import tamakihealthLogo from '../../assets/tamaki-health.png';
import weLogo from '../../assets/we.png';

export const Sponsors: React.FC = () => {
  return (
    // Sponsor images layout for the sponsors page
    // Depending on number of sponsors in a rank, layout changes
    // Layout changes depending on screen size
    <div className="flex flex-col justify-center md:space-y-10 space-y-5 text-center">
      <div>
        <p className="md:mb-5 mb-3 md:text-3xl text-2xl text-[#E5CE63] font-[Poppins]">
          PLATINUM
        </p>
        <img
          src={weLogo}
          alt="We Getting to the Guts of it"
          className="md:h-40 h-25 object-contain mx-auto bg-white"
        />
      </div>

      <div>
        <p className="md:mb-5 mb-3 md:text-3xl text-2xl text-[#E5CE63] font-[Poppins]">
          GOLD
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center md:gap-8 gap-4">
          <img
            src={respmedLogo}
            alt="RESPMED"
            className="md:w-30 md:h-30 w-20 h-20 object-contain bg-white"
          />
          <img
            src={tamakihealthLogo}
            alt="Tamaki Health"
            className="md:w-30 md:h-30 w-20 h-20 object-contain bg-white"
          />
        </div>
      </div>

      <div>
        <p className="md:mb-5 mb-3 md:text-3xl text-2xl text-[#E5CE63] font-[Poppins]">
          SILVER
        </p>
        <img
          src={pizzaclubLogo}
          alt="Pizza Club"
          className="md:h-20 h-10 object-contain mx-auto bg-white"
        />
      </div>

      <div>
        <p className="md:mb-5 mb-3 md:text-3xl text-2xl text-[#E5CE63] font-[Poppins]">
          BRONZE
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
          <img
            src={medworldLogo}
            alt="MedWorld Institute"
            className="md:h-20 h-10 object-contain bg-white"
          />
          <img
            src={mpsLogo}
            alt="MPS"
            className="md:h-20 h-10 object-contain bg-white"
          />
        </div>
      </div>
    </div>
  );
};
