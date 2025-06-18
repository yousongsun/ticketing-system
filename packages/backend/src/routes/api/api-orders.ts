import express, { type Request, type Response } from 'express';
import {
  createOrder,
  deleteOrder,
  retrieveOrderByEmail,
  retrieveOrderById,
  retrieveOrderList,
  updateOrder,
  updateOrderPaid,
} from '../../data/order-dao';

const router = express.Router();

interface CreateOrderRequest extends Request {
  body: {
    email: string;
    dateOfShow: string;
    numberOfTickets: number;
    seats: string[];
    paid: boolean;
  };
}

router.post(
  '/create-order',
  async (req: CreateOrderRequest, res: Response): Promise<void> => {
    // Create order is a route which takes valid order information
    // and creates an order in the database
    // ------------------------------------
    // ROUTE BODY:
    // userID (ObjectID): ID of the user with the order
    // numberOfTickets (int): The number of tickets the order contains
    // seats (seats[]): An array of seats
    // TODO: Difference between students etc.
    // ------------------------------------
    // ROUTE RETURN:
    // data: {
    //  orderID: ObjectID
    // }
    const { email, dateOfShow, numberOfTickets, seats } = req.body;
    // Check for missing fields
    if (!email) {
      res.status(400).json({
        error: 'Missing email',
      });
      return;
    }
    if (!dateOfShow) {
      res.status(400).json({
        error: 'Missing date of show',
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
      formattedSeats[i] =
        `${Number.parseInt(number, 10)}${letter.toUpperCase()}`;
    }

    const order = await createOrder(
      email,
      dateOfShow,
      numberOfTickets,
      formattedSeats,
    );
    if (!order) {
      res.status(500).json({
        error: 'Unable to save document to database',
      });
      return;
    }
    // If the order saves, then return the orderID to the user

    res.status(200).json({
      data: {
        orderID: order._id,
      },
    });
  },
);

// Create new order
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, dateOfShow, numberOfTickets, seats } = req.body;

    // Check for missing fields
    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!dateOfShow) {
      res.status(400).json({ error: 'Missing date of show' });
      return;
    }
    if (!numberOfTickets) {
      res.status(400).json({ error: 'Missing number of tickets' });
      return;
    }
    if (!seats) {
      res.status(400).json({ error: 'Missing number of seats' });
      return;
    }
    if (numberOfTickets !== seats.length) {
      res.status(400).json({
        error: "Number of tickets doesn't match number of seats booked",
      });
      return;
    }

    // Check that all the seats follow the correct format
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
      formattedSeats[i] =
        `${Number.parseInt(number, 10)}${letter.toUpperCase()}`;
    }

    const order = await createOrder(
      email,
      dateOfShow,
      numberOfTickets,
      formattedSeats,
    );
    if (!order) {
      res.status(500).json({ error: 'Unable to save document to database' });
      return;
    }

    res.status(201).json({
      data: {
        orderID: order._id,
      },
    });
  } catch (error) {
    res.sendStatus(422);
  }
});

router.get('/get-order', async (req: Request, res: Response): Promise<void> => {
  // Get order is a route which takes a orderID
  // and returns the order information
  // ------------------------------------
  // ROUTE BODY:
  // email (string): ID of the order
  // ------------------------------------
  // ROUTE RETURN:
  // data: {
  // orderID: ObjectID
  // email: email
  // numberOfTickets: int
  // seats: seats[]
  // paid: boolean
  // }
  // ------------------------------------
  const { email } = req.body;
  // The user does not provide a order id on the route
  if (!email) {
    res.status(400).json({
      error: 'Missing the email',
    });
    return;
  }
  // Check if valid id for mongoose
  // Find the order in the DB
  const order = await retrieveOrderByEmail(email);
  // If the order exists return the information
  if (order) {
    res.status(200).json({
      order,
    });
    return;
  }
  // If the order doesn't exist, exit on 404
  res.status(404).json({
    error: 'Email not in database',
  });
});

// Retrive all orders
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await retrieveOrderList();
    res.status(200).json({
      orders,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Unable to retrieve orders from database',
    });
  }
});

// Retrive order by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({
      error: 'Missing the order ID',
    });
    return;
  }
  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }
  const order = await retrieveOrderById(id);
  if (order) {
    res.status(200).json({
      order,
    });
    return;
  }
  res.status(404).json({
    error: 'Order not found',
  });
});

// TODO: Bug — one email can have multiple orders
router.patch(
  '/order-paid',
  async (req: Request, res: Response): Promise<void> => {
    // Order paid is a route which takes a orderID
    // and updates the order to paid
    // ------------------------------------
    // ROUTE BODY:
    // email (email): Email of the order
    // ------------------------------------
    // ROUTE RETURN:
    // data: {
    // orderID: ObjectID
    // userID: ObjectID
    // numberOfTickets: int
    // seats: seats[]
    // paid: boolean
    // }
    // ------------------------------------
    const { email } = req.body;
    if (!email) {
      res.status(400).json({
        error: 'Missing the email',
      });
      return;
    }
    const order = await updateOrderPaid(email);
    if (!order) {
      res.status(404).json({
        error: 'Email not in database',
      });
      return;
    }
    res.status(200).json({
      order,
    });
  },
);

// Update order
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const order = req.body;

  if (!id) {
    res.status(400).json({
      error: 'Missing the order ID',
    });
    return;
  }
  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  order._id = id;
  console.log(order);
  const success = await updateOrder(order);
  res.sendStatus(success ? 204 : 404);
});

// Delete order
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await deleteOrder(id);
  res.sendStatus(204);
});

export default router;
