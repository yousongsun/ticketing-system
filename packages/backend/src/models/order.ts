import mongoose, { Schema, model, type Document } from 'mongoose';

interface Order extends Document {
  email: string;
  numberOfTickets: number;
  seats: string[];
  paid: boolean;
}

const orderSchema = new Schema<Order>({
  email: { type: String, required: true },
  numberOfTickets: { type: Number, required: true },
  seats: { type: [String], required: true },
  paid: { type: Boolean, required: true },
});

export default model<Order>('Order', orderSchema);
