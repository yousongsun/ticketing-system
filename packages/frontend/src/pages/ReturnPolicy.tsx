import type React from 'react';

const ReturnPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#070507] text-[#FFFBE8] font-opensans flex flex-col items-center justify-center p-10">
      <h1 className="text-[32px] text-[#E5CE63] font-bold mb-6">
        Return &amp; Refund Policy
      </h1>
      <p className="text-lg mb-4 text-center max-w-xl">
        Tickets purchased for Auckland Medical Revue are non-refundable except
        where required by New Zealand consumer law. The 3% booking fee is not
        refundable under any circumstances.
      </p>
      <a href="/" className="underline text-[#FFF0A2]">
        Return Home
      </a>
    </div>
  );
};

export default ReturnPolicyPage;
