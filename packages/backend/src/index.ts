import express, { type Express, type Request, type Response } from 'express';

import cors from 'cors';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import routes from './routes/routes';
import webhookRoutes from './routes/webhook-routes';
// Load environment variables from the .env file
dotenv.config();

console.log(process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET);
const PORT: number = Number(process.env.PORT) || 3000;
const DB_URL: string = process.env.DB_URL
  ? process.env.DB_URL
  : 'mongodb://localhost:27017/mmss';

const app: Express = express();
app.use('/webhooks', webhookRoutes);
// Enable CORS for all origins, allow specific HTTP methods, and include cookies in cross-origin requests
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
  }),
);

// Allow larger JSON payloads
app.use(express.json({ limit: '50mb' }));
// Serve static files from the 'public' directory
app.use(express.static('public'));

// app.get('/', (_req: Request, res: Response): void => {
//   res.send('Med Revue Hub!');
// });

app.use('/', routes);

(async () => {
  // Start the DB running. Then, once it's connected, start the server.
  const mongod = await MongoMemoryServer.create();
  const DB_URL = mongod.getUri();

  await mongoose.connect(DB_URL);
  // Start the Express server and allow external access
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
