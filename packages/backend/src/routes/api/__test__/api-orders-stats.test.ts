import express, { type Express } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';
import { Order } from '../../../models/order';
import ordersRouter from '../api-orders';

let app: Express;

beforeAll(async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  app = express();
  app.use(express.json());
  app.use('/api/v1/orders', ordersRouter);

  await Order.create([
    {
      firstName: 'A',
      lastName: 'B',
      email: 'a@example.com',
      phone: '1',
      isStudent: false,
      studentCount: 0,
      selectedDate: '2025-08-15',
      selectedSeats: [
        { rowLabel: 'A', number: 1, seatType: 'Standard' },
        { rowLabel: 'A', number: 2, seatType: 'VIP' },
      ],
      totalPrice: 80,
      checkoutSessionId: 'sess1',
      paid: true,
    },
    {
      firstName: 'C',
      lastName: 'D',
      email: 'c@example.com',
      phone: '2',
      isStudent: true,
      studentCount: 1,
      selectedDate: '2025-08-16',
      selectedSeats: [{ rowLabel: 'B', number: 1, seatType: 'Standard' }],
      totalPrice: 35,
      checkoutSessionId: 'sess2',
      paid: true,
    },
  ]);
});

describe('GET /api/v1/orders/stats', () => {
  test('should return totals for paid orders', async () => {
    const response = await request(app)
      .get('/api/v1/orders/stats')
      .set('x-internal-secret', 'secret');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      totalSoldPrice: 115,
      totalOrders: 2,
      totalSeatsOrdered: 3,
    });
  });
});
