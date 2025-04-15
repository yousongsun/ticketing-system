import express, { type Router } from 'express';

// Create a new express Router
const router: Router = express.Router();

// Import child routes
import testsRoutes from './api-tests';
import usersRoutes from './api-user';
router.use('/tests', testsRoutes);
router.use('/user', usersRoutes);

export default router;
