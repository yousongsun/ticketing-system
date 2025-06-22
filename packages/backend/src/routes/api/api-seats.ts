import type { SeatType } from '@medrevue/types';
import express, { type Request, type Response } from 'express';
import { retrieveSeatListByDate } from '../../data/seat-dao';
import redisClient from '../../redis/redisClient';

const router = express.Router();

// router.get('/all', async (req: Request, res: Response): Promise<void> => {
//   try {
//     const seats = await retrieveSeatList();
//     res.status(200).json({
//       seats,
//     });
//   } catch (error) {
//     res.status(500).json({
//       error: 'Unable to retrieve seats from database',
//     });
//   }
// });

router.get('/all', async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.query;
    if (!date || typeof date !== 'string') {
      res.status(400).json({ error: 'Missing date' });
      return;
    }

    const redisKey = `seats:${date}`;
    let seatData: Record<string, SeatType[]> | null = null;

    const cached = await redisClient.get(redisKey);
    if (cached) {
      seatData = JSON.parse(cached);
    } else {
      const seats = await retrieveSeatListByDate(date);

      seatData = {};
      for (const seat of seats) {
        const label = seat.rowLabel;
        if (!seatData[label]) {
          seatData[label] = [];
        }
        seatData[label].push(seat);
      }

      await redisClient.set(redisKey, JSON.stringify(seatData), {
        EX: 3 * 24 * 60 * 60,
      });
    }

    const lockKeys = await redisClient.keys(`seatlock:${date}:*`);
    if (seatData) {
      for (const key of lockKeys) {
        const [rowLabel, num] = key.split(':')[2].split('-');
        const seatNum = Number.parseInt(num, 10);
        const row = seatData[rowLabel];
        if (row) {
          const seat = row.find((s) => s.number === seatNum);
          if (seat) {
            seat.available = false;
            seat.selected = true;
          }
        }
      }
    }

    res.status(200).json(seatData);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Unable to retrieve seats from database',
    });
  }
});

router.post('/select', async (req: Request, res: Response): Promise<void> => {
  try {
    const { seatNumber, date } = req.body;
    if (!seatNumber || !date) {
      res.status(400).json({ error: 'Missing seatNumber or date' });
      return;
    }

    const match = /^([A-Za-z]+)(\d+)$/.exec(seatNumber);
    if (!match) {
      res.status(400).json({ error: 'Invalid seat number format' });
      return;
    }
    const rowLabel = match[1];
    const number = Number.parseInt(match[2], 10);

    const lockKey = `seatlock:${date}:${rowLabel}-${number}`;
    const exists = await redisClient.exists(lockKey);
    if (exists) {
      res.status(409).json({ error: 'Seat already reserved' });
      return;
    }

    await redisClient.set(lockKey, 'locked', { EX: 15 * 60 });

    res.status(200).json({ message: 'Seat reserved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reserve seat' });
  }
});

export default router;
