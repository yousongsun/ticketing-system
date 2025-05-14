import express, { type Express, type Request, type Response } from 'express';

import cors from 'cors';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import routes from './routes/routes';

// Load environment variables from the .env file
dotenv.config();

const PORT: number = Number(process.env.PORT) || 3000;
const app: Express = express();

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
  // Create a new MongoDB in-memory server instance and connect to it using Mongoose
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  console.log(uri);
  // Start the Express server and allow external access
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
