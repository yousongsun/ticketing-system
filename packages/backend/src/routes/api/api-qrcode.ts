import crypto from 'node:crypto';
import express, { type Request, type Response } from 'express';
import QRCode from 'qrcode';
import { Order } from '../../models/order';

const router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { seatNumber, date } = req.query;
    if (!seatNumber || typeof seatNumber !== 'string') {
      res.status(400).json({ error: 'Missing seatNumber' });
      return;
    }
    if (!date || typeof date !== 'string') {
      res.status(400).json({ error: 'Missing date' });
      return;
    }

    const match = /^([A-Za-z]+)(\d+)$/.exec(seatNumber);
    if (!match) {
      res.status(400).json({ error: 'Invalid seat number format' });
      return;
    }
    const rowLabel = match[1];
    const number = Number.parseInt(match[2], 10);

    const existing = await Order.findOne({
      selectedDate: date,
      selectedSeats: { $elemMatch: { rowLabel, number } },
    }).exec();

    if (existing) {
      res.status(409).json({ error: 'Seat already booked' });
      return;
    }

    const secret = process.env.QRCODE_SECRET;
    if (!secret) {
      res.status(500).json({ error: 'QRCODE_SECRET not configured' });
      return;
    }

    const payload = `${seatNumber}:${date}`;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const signature = hmac.digest('hex');
    const qrPayload = `${payload}.${signature}`;

    const qrCode = await QRCode.toDataURL(qrPayload);
    res.status(200).json({ qrCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

export default router;
