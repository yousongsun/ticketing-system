import express, { type Request, type Response } from 'express';
import mongoose, { MongooseError } from 'mongoose';
import { Schema } from 'mongoose';

//This is a temporary User model.

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required.'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required.'],
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
});

const User = mongoose.model('User', userSchema);

const router = express.Router();

type userBody = {
  username: string;
  email: string;
  password: string;
};

router.post(
  '/register',
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const userBody = _req.body as userBody;

      // both functions for checking existence of uniqueness of the email and the username can be simplified into a middleware

      const emailExists = await User.findOne({ email: userBody.email });
      const usernameExists = await User.findOne({
        username: userBody.username,
      });

      if (emailExists) {
        res
          .status(409)
          .send(`Email ${userBody.email} has already been registered`);
        return;
      }

      if (usernameExists) {
        res.status(409).send(`Username ${userBody.username} is taken`);
        return;
      }

      //TODO: password hashing has not yet been implemented.

      await User.create({
        username: userBody.username,
        email: userBody.email,
        password: userBody.password,
      });

      res.sendStatus(201);
    } catch (error) {
      //https://masteringjs.io/tutorials/mongoose/e11000-duplicate-key
      res.status(500).send(error);
    }
  },
);

export default router;
