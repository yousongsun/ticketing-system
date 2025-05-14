import express, { type Express } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';
import apiTestsRouter from '../api-tests';
import orderRouter from '../order-routes';

let app: Express;

// Setup
beforeAll(async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  app = express();
  app.use(express.json());
  app.use('/api/v1/order', orderRouter);
});

describe('POST /api/v1/order/create-order successful', () => {
  test('Should return a JSON response with the order', async () => {
    const response = await request(app)
      .post('/api/v1/order/create-order')
      .send({
        userID: '45',
        numberOfTickets: 4,
        seats: ['21B', '21C', '24B', '30X'],
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        orderID: expect.any(String),
      },
    });
  });
});

describe('POST /api/v1/order/create-order missing userID', () => {
  test('Should return a 400 error', async () => {
    const response = await request(app)
      .post('/api/v1/order/create-order')
      .send({
        numberOfTickets: 4,
        seats: ['21B', '21C', '24B', '30X'],
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Missing user id',
    });
  });
});
describe('POST /api/v1/order/create-order missing numberOfTickets', () => {
  test('Should return a 400 error', async () => {
    const response = await request(app)
      .post('/api/v1/order/create-order')
      .send({
        userID: '45',
        seats: ['21B', '21C', '24B', '30X'],
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Missing number of tickets',
    });
  });
});

describe('POST /api/v1/order/create-order missing seats', () => {
  test('Should return a 400 error', async () => {
    const response = await request(app)
      .post('/api/v1/order/create-order')
      .send({
        userID: '45',
        numberOfTickets: 4,
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Missing number of seats',
    });
  });
});

describe('GET /api/v1/order/get-order orderID not in database', () => {
  test('Should return a 400 error', async () => {
    const response = await request(app).get('/api/v1/order/get-order').send({
      orderID: '123456789012345678901234',
    });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'OrderID not in database',
    });
  });
});
describe('Create order and then get order', () => {
  test('Should return a 200 response with the order', async () => {
    const createResponse = await request(app)
      .post('/api/v1/order/create-order')
      .send({
        userID: '45',
        numberOfTickets: 4,
        seats: ['21B', '21C', '24B', '30X'],
      });
    const orderID = createResponse.body.data.orderID;
    const getResponse = await request(app).get('/api/v1/order/get-order').send({
      orderID: orderID,
    });
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.order).toEqual(
      expect.objectContaining({
        userID: '45',
        numberOfTickets: 4,
        seats: ['21B', '21C', '24B', '30X'],
        paid: false,
      }),
    );
  });
});

describe('Create order, get order, pay order', () => {
  test('Should return a 200 response with the order', async () => {
    const createResponse = await request(app)
      .post('/api/v1/order/create-order')
      .send({
        userID: '45',
        numberOfTickets: 4,
        seats: ['21B', '21C', '24B', '30X'],
      });
    const orderID = createResponse.body.data.orderID;
    const getResponse = await request(app).get('/api/v1/order/get-order').send({
      orderID: orderID,
    });
    const patchResponse = await request(app)
      .patch('/api/v1/order/order-paid')
      .send({
        orderID: orderID,
      });
    expect(patchResponse.status).toBe(200);
    expect(patchResponse.body).toEqual({
      order: expect.objectContaining({
        userID: '45',
        numberOfTickets: 4,
        seats: ['21B', '21C', '24B', '30X'],
        paid: true,
      }),
    });
  });
});

describe('patch /api/v1/order/order-paid orderID not in database', () => {
  test('Should return a 404 error', async () => {
    const response = await request(app).patch('/api/v1/order/order-paid').send({
      orderID: '123456789012345678901234',
    });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'OrderID not in database',
    });
  });
});
