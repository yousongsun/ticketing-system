import axios from 'axios';
import type React from 'react';
import { useState } from 'react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

const InternalQRCode: React.FC = () => {
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (): Promise<void> => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/qrcode?seatNumber=A32&date=2025-08-14`,
        {
          headers: { 'x-internal-secret': secret },
        },
      );
      setQrCode(res.data.qrCode);
      setError('');
    } catch (e) {
      setError('Failed to verify secret or fetch QR code');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#070507] text-[#FFFBE8] font-opensans flex flex-col items-center justify-center gap-4 p-6">
      {qrCode ? (
        <img src={qrCode} alt="QR Code" className="w-64 h-64" />
      ) : (
        <>
          <h1 className="text-[32px] text-[#E5CE63] font-bold">
            Internal QR Access
          </h1>
          <input
            type="password"
            placeholder="Enter secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="p-2 text-black rounded"
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-[#E5CE63] text-black font-bold px-4 py-2 rounded"
          >
            Submit
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </>
      )}
    </div>
  );
};

export default InternalQRCode;
