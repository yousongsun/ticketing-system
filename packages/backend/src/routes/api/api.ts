import express, { type Router } from 'express';

// Create a new express Router
const router: Router = express.Router();

// Import child routes
import testsRoutes from './api-tests';
router.use('/tests', testsRoutes);

// Import user route
import usersRoutes from './api-users';
router.use('/users', usersRoutes);

// Import seat selection route
import seatRoutes from './api-seats';
router.use('/seats', seatRoutes);

// Import order route
import ordersRoutes from './api-orders';
router.use('/order', ordersRoutes);

export default router;
