import type { OrderType } from '@medrevue/types';
import mongoose, { Schema, type Document, type Model } from 'mongoose';

interface IOrder extends OrderType, Document {}

const orderSchema: Schema<IOrder> = new Schema(
  {
    email: { type: String, required: true },
    dateOfShow: { type: String, required: true },
    numberOfTickets: { type: Number, required: true },
    seats: { type: [String], required: true },
    paid: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  },
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export { Order, type IOrder };
