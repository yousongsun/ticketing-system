import express, { type Request, type Response } from 'express';
import Stripe from 'stripe';
import {
  createOrder,
  deleteOrder,
  retrieveOrderByEmail,
  retrieveOrderById,
  retrieveOrderList,
  updateOrder,
} from '../../data/order-dao';
import { markSeatsUnavailable } from '../../data/seat-dao';
import { verifyInternalRequest } from '../../middleware/verify-internal-request';
import redisClient from '../../redis/redisClient';
import { refreshSeatCache } from '../../redis/seatCache';
import { sendConfirmationEmail } from '../../utils/sendConfirmationEmail';
import { verifySeats } from '../../utils/verifySeats';

declare module 'express-session' {
  interface SessionData {
    views?: number;
    userId?: string;
    isLoggedIn?: boolean;
    orderId?: string;
  }
}

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) throw new Error('Missing STRIPE_SECRET_KEY in environment');

const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-05-28.basil',
});

const router = express.Router();

interface CreateOrderRequest extends Request {
  body: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    isStudent: boolean;
    studentCount: number;
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
        studentCount,
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
      if (typeof studentCount !== 'number') {
        res.status(400).json({ error: 'Missing student count' });
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

      const invalidSeats = await verifySeats(
        selectedDate,
        selectedSeats.map((s) => ({ rowLabel: s.rowLabel, number: s.number })),
        req.sessionID,
      );
      if (invalidSeats.length > 0) {
        res
          .status(409)
          .json({ error: 'Seats no longer available', invalidSeats });
        return;
      }

      for (const seat of selectedSeats) {
        const lockKey = `seatlock:${selectedDate}:${seat.rowLabel}-${seat.number}`;
        await redisClient.expire(lockKey, 30 * 60);
      }

      const order = await createOrder(
        firstName,
        lastName,
        email,
        phone,
        isStudent,
        studentCount,
        selectedDate,
        selectedSeats,
        totalPrice,
      );

      if (!order) {
        res.status(500).json({ error: 'Unable to save document to database' });
        return;
      }

      req.session.orderId = (
        order._id as string | { toString(): string }
      ).toString();

      res.status(201).json({
        sessionId: order.checkoutSessionId,
        orderId: order._id,
      });
    } catch (error) {
      res.sendStatus(422);
    }
  },
);

// Retrive all orders
router.get(
  '/',
  verifyInternalRequest,
  async (_req: Request, res: Response): Promise<void> => {
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
  },
);

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
router.put(
  '/:id',
  verifyInternalRequest,
  async (req: Request, res: Response): Promise<void> => {
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
  },
);

router.get(
  '/order-status/:id',
  async (req: Request, res: Response): Promise<void> => {
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

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    try {
      const sessionId = order.checkoutSessionId;
      if (!sessionId) {
        res.status(400).json({ message: 'Session ID is required' });
        return;
      }
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (!session) {
        res.status(404).json({ message: 'Session not found' });
        return;
      }
      const paymentIntent = session.payment_intent;
      if (!paymentIntent) {
        res
          .status(404)
          .json({ message: 'Payment intent not found for this session' });
        return;
      }
      const paymentIntentId =
        typeof paymentIntent === 'string' ? paymentIntent : paymentIntent.id;
      const paymentIntentDetails =
        await stripe.paymentIntents.retrieve(paymentIntentId);
      if (!paymentIntentDetails) {
        res.status(404).json({ message: 'Payment intent details not found' });
        return;
      }
      if (paymentIntentDetails.status === 'succeeded' && !order.paid) {
        const invalidSeats = await verifySeats(
          order.selectedDate,
          order.selectedSeats.map((s) => ({
            rowLabel: s.rowLabel,
            number: s.number,
          })),
          req.sessionID,
        );
        if (invalidSeats.length > 0) {
          res
            .status(409)
            .json({ message: 'Seats no longer available', invalidSeats });
          return;
        }
        // Update order status to paid
        order.paid = true;
        await updateOrder(order);
        await markSeatsUnavailable(
          order.selectedDate,
          order.selectedSeats.map((s) => ({
            rowLabel: s.rowLabel,
            number: s.number,
          })),
        );
        for (const seat of order.selectedSeats) {
          const lockKey = `seatlock:${order.selectedDate}:${seat.rowLabel}-${seat.number}`;
          await redisClient.del(lockKey);
        }
        await redisClient.del(`seats:${order.selectedDate}`);
        await refreshSeatCache(order.selectedDate);

        // Send confirmation email
        await sendConfirmationEmail(order);
      }
      res.status(200).json({ paymentStatus: paymentIntentDetails.status });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          'Stripe Checkout Session payment status retrieval error:',
          error.message,
        );
      } else {
        console.error(
          'Stripe Checkout Session payment status retrieval error:',
          error,
        );
      }
      res.status(500).json({ message: 'Failed to retrieve payment status' });
    }
  },
);

// Manually trigger a confirmation email resend
router.post(
  '/:id/send-email',
  verifyInternalRequest,
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Missing the order ID' });
      return;
    }
    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    const order = await retrieveOrderById(id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    await sendConfirmationEmail(order);
    res.sendStatus(204);
  },
);

// Delete order
router.delete(
  '/:id',
  verifyInternalRequest,
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await deleteOrder(id);
    res.sendStatus(204);
  },
);

export default router;
