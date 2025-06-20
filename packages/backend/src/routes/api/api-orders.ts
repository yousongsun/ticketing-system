import express, { type Request, type Response } from 'express';
import {
  createOrder,
  deleteOrder,
  retrieveOrderByEmail,
  retrieveOrderById,
  retrieveOrderList,
  updateOrder,
} from '../../data/order-dao';

const router = express.Router();

interface CreateOrderRequest extends Request {
  body: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    isStudent: boolean;
    selectedDate: string;
    selectedSeats: {
      rowLabel: string;
      number: number;
      seatType: 'Standard' | 'VIP';
    }[];
    totalPrice: number;
    paid: boolean;
  };
}
// Create new order
router.post(
  '/',
  async (req: CreateOrderRequest, res: Response): Promise<void> => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        isStudent,
        selectedDate,
        selectedSeats,
        totalPrice,
        paid,
      } = req.body;

      // Validate required fields
      if (!firstName) {
        res.status(400).json({ error: 'Missing first name' });
        return;
      }
      if (!lastName) {
        res.status(400).json({ error: 'Missing last name' });
        return;
      }
      if (!email) {
        res.status(400).json({ error: 'Missing email' });
        return;
      }
      if (!phone) {
        res.status(400).json({ error: 'Missing phone' });
        return;
      }
      if (typeof isStudent !== 'boolean') {
        res.status(400).json({ error: 'Missing isStudent' });
        return;
      }
      if (!selectedDate) {
        res.status(400).json({ error: 'Missing selected date' });
        return;
      }
      if (!Array.isArray(selectedSeats) || selectedSeats.length === 0) {
        res.status(400).json({ error: 'Missing selected seats' });
        return;
      }
      if (typeof totalPrice !== 'number') {
        res.status(400).json({ error: 'Missing total price' });
        return;
      }
      if (typeof paid !== 'boolean') {
        res.status(400).json({ error: 'Missing paid status' });
        return;
      }

      // Validate selectedSeats format
      for (const seat of selectedSeats) {
        if (
          typeof seat.rowLabel !== 'string' ||
          typeof seat.number !== 'number' ||
          (seat.seatType !== 'Standard' && seat.seatType !== 'VIP')
        ) {
          res.status(400).json({ error: 'Invalid seat format' });
          return;
        }
      }

      const order = await createOrder(
        firstName,
        lastName,
        email,
        phone,
        isStudent,
        selectedDate,
        selectedSeats,
        totalPrice,
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
  },
);

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
