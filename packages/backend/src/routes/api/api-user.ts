import bcrypt from 'bcrypt';
import express, { type Request, type Response } from 'express';
import mongoose, {
  Schema,
  model,
  type Document,
  Mongoose,
  MongooseError,
  type InferSchemaType,
} from 'mongoose';

const router = express.Router();

interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
}

//This is a temporary User model.

const userSchema = new Schema({
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

const User = model<UserDocument>('User', userSchema);
type User = InferSchemaType<typeof userSchema>;

type UserLogin = {
  email: string;
  password: string;
};

router.post(
  '/register',
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const userBody = _req.body as User;

      //check if user exists
      const emailExists = await User.findOne({ email: userBody.email });

      if (emailExists) {
        res
          .status(409)
          .send(`Email ${userBody.email} has already been registered`);
        return;
      }

      //generate salt and hash the password before storing
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

      res.sendStatus(500);
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

    res.status(200).json({ id: emailExists._id });
  } catch (error) {
    res.sendStatus(500);
  }
});

export default router;
