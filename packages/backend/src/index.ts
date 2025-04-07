import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

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

app.get('/', (_req: Request, res: Response): void => {
  res.send('Med Revue Hub!');
});

// Start the Express server and allow external access
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
