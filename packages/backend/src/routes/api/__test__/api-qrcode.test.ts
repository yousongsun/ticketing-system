import express, { type Express } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { Order } from '../../../models/order';
import qrCodeRouter from '../api-qrcode';

let app: Express;

beforeAll(async () => {
  process.env.QRCODE_SECRET = 'testsecret';
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  app = express();
  app.use(express.json());
  app.use('/api/v1/qrcode', qrCodeRouter);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET /api/v1/qrcode', () => {
  test('should generate qr code for available seat', async () => {
    const response = await request(app)
      .get('/api/v1/qrcode')
      .query({ seatNumber: 'A1', date: '2024-06-01' });

    expect(response.status).toBe(200);
    expect(response.body.qrCode).toMatch(/^data:image\/png;base64,/);
  });

  test('should reject seat that already has an order', async () => {
    await Order.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '123',
      isStudent: false,
      studentCount: 0,
      selectedDate: '2024-06-01',
      selectedSeats: [{ rowLabel: 'A', number: 1, seatType: 'Standard' }],
      totalPrice: 10,
      checkoutSessionId: 'sess',
      paid: true,
    });

    const response = await request(app)
      .get('/api/v1/qrcode')
      .query({ seatNumber: 'A1', date: '2024-06-01' });

    expect(response.status).toBe(409);
  });
});
