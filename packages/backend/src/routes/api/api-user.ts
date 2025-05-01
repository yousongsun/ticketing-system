import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import express, { type Request, type Response } from 'express';
import mongoose, { type Document, Mongoose, MongooseError } from 'mongoose';
import { Schema } from 'mongoose';
import type { T } from 'vitest/dist/chunks/environment.d.C8UItCbf';

const router = express.Router();

//This is a temporary User model.

const userSchema: mongoose.Schema = new mongoose.Schema({
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

interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
}

const User = mongoose.model<UserDocument>('User', userSchema);

type User = {
  username: string;
  email: string;
  password: string;
};

type UserLogin = {
  email: string;
  password: string;
};

router.post(
  '/register',
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const userBody = _req.body as User;

      const emailExists = await User.findOne({ email: userBody.email });

      if (emailExists) {
        res
          .status(409)
          .send(`Email ${userBody.email} has already been registered`);
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userBody.password, salt);

      const user = await User.create({
        username: userBody.username,
        email: userBody.email,
        password: hashedPassword,
      });

      res.status(201).json({ id: user._id });
    } catch (error) {
      //NOTE: you may alternatively catch the mongoose server error for duplicate keys

      // if (error instanceof mongoose.mongo.MongoServerError) {
      //   res
      //     .status(409)
      //     .send(
      //       `${Object.keys(error.keyValue)[0]} ${Object.values(error.keyValue)[0]} already exists.`,
      //     );
      //   return;
      // }

      res.status(500).send(error);
    }
  },
);

router.post('/login', async (_req: Request, res: Response): Promise<void> => {
  try {
    const userBody = _req.body as UserLogin;

    const emailExists = await User.findOne({ email: userBody.email });

    if (!emailExists) {
      res.status(404).send(`Email ${userBody.email} was not found.`);
      return;
    }

    const comparePasswords = await bcrypt.compare(
      userBody.password,
      emailExists.password,
    );

    if (!comparePasswords) {
      res.status(400).send('Passwords do not match.');
      return;
    }

    res.status(200).send('Logged in!');
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
