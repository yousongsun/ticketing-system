import express, { type Router } from 'express';

// Create a new express Router
const router: Router = express.Router();

// Import child routes
import testsRoutes from './api-tests';
router.use('/tests', testsRoutes);

import orderRoutes from './order-routes';
router.use('/order', orderRoutes);

export default router;
