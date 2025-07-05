import axios from 'axios';
import type React from 'react';
import medrevuePoster from '../assets/medrevue-poster.png';

import { useEffect, useRef, useState } from 'react';
import checkCircle from '../assets/check-circle.svg';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

const SuccessPage: React.FC = () => {
  const boxText = 'text-[#FFFBE8] font-[Poppins]';
  const [status, setStatus] = useState<string>('pending');
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const orderId = sessionStorage.getItem('orderId');
    if (!orderId) {
      setStatus('missing');
      return;
    }

    const fetchStatus = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/orders/order-status/${orderId}`,
          { withCredentials: true },
        );
        if (res.data.paymentStatus) {
          setStatus(res.data.paymentStatus);
          if (res.data.paymentStatus === 'succeeded' && intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      } catch (e) {
        console.error('Failed to fetch payment status', e);
      }
    };

    fetchStatus();
    intervalRef.current = window.setInterval(fetchStatus, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (status === 'missing') {
    return (
      <div className="min-h-screen w-full bg-[#070507] text-[#FFFBE8] flex items-center justify-center">
        <p>No order information found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#070507] text-[#FFFBE8] font-opensans px-6 py-12 sm:px-12 md:px-20 lg:px-32 flex flex-col items-center justify-center">
      {status === 'succeeded' ? (
        <>
          {/* <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-[#E5CE63]">
              Payment Successful
            </h1>
            <p>Your order has been confirmed.</p>
          </div> */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 w-full pt-20 pb-20">
            {/* Left */}
            <div className="w-full lg:w-1/2 space-y-6 relative pl-18">
              {/* Order number */}
              <p className="text-[14px] text-[#FFFBE8] opacity-80">
                Order {sessionStorage.getItem('orderId') || 'N/A'}
              </p>

              {/* Icon + Heading protrude to left of alignment*/}
              <div className="flex items-center">
                <img
                  src={checkCircle}
                  alt="Success Icon"
                  className="w-14 h-14 -ml-10 mr-4"
                />
                <h1
                  className="text-[32px] text-[#E5CE63] font-bold font-[Inter]"
                  style={{ letterSpacing: '-0.03em' }}
                >
                  Thank you!
                </h1>
              </div>

              <br />

              {/* Confirmation */}
              <div className="space-y-6 text-[18px]">
                <p className="font-bold text-[#E5CE63]">
                  Your order has been confirmed!
                </p>
                <p>
                  {' '}
                  Your tickets and order details will be sent via email soon!{' '}
                </p>
                <p>
                  {' '}
                  Thank you for purchasing a ticket to Auckland Medical Revue
                  2025: Back to the Suture presented by Waitemata Endoscopy!
                  We're thrilled to have you join us for an unforgettable night
                  of laughs, music, and medical mayhem.
                </p>
                <p> All profits go towards Médecins Sans Frontières (MSF). </p>
              </div>

              <br />
              <br />

              {/* Footer */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-[14px] font-bold">
                  Need help?{' '}
                  <a
                    href="mailto:aucklandmedicalrevue@gmail.com"
                    className="underline text-[#FFF0A2]"
                  >
                    Contact Us
                  </a>
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="w-full lg:w-1/2 text-right space-y-6">
              <div className="flex justify-end gap-4 text-[#FFF0A2] font-bold text-[18px]">
                <span>14th August</span>
                <span>|</span>
                <span>07:30pm - 10:00pm</span>
              </div>

              <h2 className="text-[24px] sm:text-[32px] font-bold text-[#E5CE63]">
                BACK TO THE SUTURE
              </h2>

              {/* Order summary box */}

              <div className="ml-auto w-full max-w-sm border border-[#FFFBE8] rounded-md overflow-hidden bg-[#070507]">
                {/* Header */}
                <div className="bg-[#070507] border-b border-[#FFFBE8] px-6 py-4">
                  <h3 className="text-[#E5CE63] text-lg font-bold text-left">
                    Order Summary
                  </h3>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                  {/* Poster + Info */}
                  <div className="flex gap-4">
                    <img
                      src={medrevuePoster}
                      alt="Poster"
                      className="w-32 h-42 object-cover object-top rounded-sm"
                    />
                    <div className={`text-left ${boxText} text-sm space-y-1`}>
                      <div className="flex justify-between gap-12">
                        <span className="font-bold">Back to the Suture</span>
                        <span className="text-sm font-normal">×2</span>
                      </div>
                      <p>14th August</p>
                      <p>Seats: XX, XX</p>
                      <p>07:30pm - 10:00pm</p>
                    </div>
                  </div>

                  {/* Email */}
                  <p className={`text-sm ${boxText} text-left px-2`}>
                    {' '}
                    dpar783@aucklanduni.ac.nz
                  </p>

                  <hr className="border-[#FFFBE8] opacity-40" />

                  {/* Payment */}
                  <div
                    className={`flex justify-between font-bold ${boxText} text-sm px-2`}
                  >
                    <span>Paid</span>
                    <span>$40.00</span>
                  </div>
                  <hr className="border-[#FFFBE8] opacity-40" />

                  {/* Returns */}
                  <a
                    href="/return-policy"
                    className={`underline text-sm ${boxText} hover:text-[#FFF0A2] block text-left px-2`}
                  >
                    Read about our return policy
                  </a>
                </div>
              </div>

              {/* End of box */}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-[#E5CE63]">
            Processing Payment...
          </h1>
          <p>Please wait while we confirm your payment.</p>
        </div>
      )}
    </div>
  );
};

export default SuccessPage;
