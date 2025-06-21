import { type ISeat, Seat } from '../models/seat';

async function retrieveSeatList(): Promise<ISeat[]> {
  return await Seat.find()
    .select('number rowLabel available selected seatType -_id')
    .exec();
}

export { retrieveSeatList };
