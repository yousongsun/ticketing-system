import express, { type Request, type Response } from 'express';
import Order from '../../models/order';

const router = express.Router();

interface CreateOrderRequest extends Request {
  body: {
    userID: string;
    numberOfTickets: number;
    seats: string[];
    paid: boolean;
  };
}

router.post('/create-order', (req: CreateOrderRequest, res: Response): void => {
  // Create order is a route which takes valid order information
  // and creates an order in the database
  // ------------------------------------
  // ROUTE BODY:
  // userID (ObjectID): ID of the user with the order
  // numberOfTickets (int): The number of tickets the order contains
  // seats (seats[]): An array of seats
  // ------------------------------------
  // ROUTE RETURN:
  // data: {
  //  orderID: ObjectID
  // }
  const { userID, numberOfTickets, seats } = req.body;
  // Check for missing fields
  if (!userID) {
    res.status(400).json({
      error: 'Missing user id',
    });
    return;
  }
  if (!numberOfTickets) {
    res.status(400).json({
      error: 'Missing number of tickets',
    });
    return;
  }
  if (!seats) {
    res.status(400).json({
      error: 'Missing number of seats',
    });
    return;
  }
  if (numberOfTickets !== seats.length) {
    res.status(400).json({
      error: "Number of tickets doesn't match number of seats booked",
    });
    return;
  }
  // Check that all the seats follow the correct format
  const seatFailure = false;
  const formattedSeats = seats.slice();
  for (let i = 0; i < seats.length; i++) {
    const seat = seats[i];
    const match = seat.match(/^(\d+)([a-zA-Z])$/);
    if (!match) {
      res.status(400).json({
        error: 'The seats are not in the right format',
      });
      return;
    }
    const [, number, letter] = match as [string, string, string];
    formattedSeats[i] = `${Number.parseInt(number, 10)}${letter.toUpperCase()}`;
  }

  // Append the order to the database
  const order = new Order({
    userID: userID,
    numberOfTickets: numberOfTickets,
    seats: formattedSeats,
    paid: false,
  });
  order
    .save()
    .then((savedDoc) => {
      // If the order saves, then return the orderID to the user
      res.status(200).json({
        data: {
          orderID: savedDoc._id,
        },
      });
    })
    .catch((err) => {
      // If the order fails return an error
      console.log(err);
      res.status(500).json({
        error: 'Unable to save document to database',
      });
    });
});

export default router;
