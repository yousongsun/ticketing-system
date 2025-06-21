import { type ISeat, Seat } from '../models/seat';

async function retrieveSeatListByDate(date: string): Promise<ISeat[]> {
  return await Seat.find({ date })
    .select('number rowLabel available selected seatType date -_id')
    .exec();
}

export { retrieveSeatListByDate };
