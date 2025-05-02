import { type Document, type InferSchemaType, Schema, model } from 'mongoose';

interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
}

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

export const User = model<UserDocument>('User', userSchema);

export type UserSchemaType = InferSchemaType<typeof userSchema>;
