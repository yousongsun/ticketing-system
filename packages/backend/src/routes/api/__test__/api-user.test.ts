import express, { type Express } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';
import apiUserRouter from '../api-user';

let app: Express;

// Setup
beforeAll(async () => {
  app = express();
  app.use(express.json());
  app.use('/api/v1/user', apiUserRouter);
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

describe('POST /api/v1/user/register', () => {
  test('should be able to register a new user', async () => {
    const response = await request(app).post('/api/v1/user/register').send({
      username: 'John Doe',
      email: 'johndoe@acme.com',
      password: 'password',
    });

    expect(response.status).toBe(201);
  });
});

describe('POST /api/v1/user/register with email conflict', () => {
  test('should throw an error since the email is already registered', async () => {
    const response = await request(app).post('/api/v1/user/register').send({
      username: 'John Doe',
      email: 'johndoe@acme.com',
      password: 'password',
    });

    expect(response.status).toBe(409);
  });
});

describe('POST /api/v1/user/register with username conflict', () => {
  test('should throw an error since the username is already registered', async () => {
    const response = await request(app).post('/api/v1/user/register').send({
      username: 'John Doe',
      email: 'janedoe@acme.com',
      password: 'password',
    });

    expect(response.status).toBe(409);
  });
});
