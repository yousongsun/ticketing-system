import express, { type Request, type Response } from 'express';
import { retrieveSeatList } from '../../data/seat-dao';

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
    const seats = await retrieveSeatList();

    // Transform to { [rowLabel]: Seat[] }
    const seatData: Record<string, (typeof seats)[0][]> = {};

    for (const seat of seats) {
      const label = seat.rowLabel;
      if (!seatData[label]) {
        seatData[label] = [];
      }
      seatData[label].push(seat);
    }

    res.status(200).json(seatData);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Unable to retrieve seats from database',
    });
  }
});

export default router;
