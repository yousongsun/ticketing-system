import dotenv from 'dotenv';
import Stripe from 'stripe';
import { type IOrder, Order } from '../models/order';

dotenv.config();
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) throw new Error('Missing STRIPE_SECRET_KEY in environment');

const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-05-28.basil',
});

async function createOrder(
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  isStudent: boolean,
  selectedDate: string,
  selectedSeats: {
    rowLabel: string;
    number: number;
    seatType: 'Standard' | 'VIP';
  }[],
  totalPrice: number,
) {
  try {
    const vipPrice = 45;
    const normalPrice = isStudent ? 25 : 35;
    const lineItems = selectedSeats.map((seat) => ({
      name: `MedRevue Ticket (${seat.seatType}) - Row ${seat.rowLabel} Seat ${seat.number}`,
      price: seat.seatType === 'VIP' ? vipPrice : normalPrice,
      quantity: 1,
    }));

    // Calculate booking fee as 3% of the ticket subtotal
    const bookingFee = +(totalPrice * 0.03).toFixed(2);
    const totalPriceWithFee = +(totalPrice + bookingFee).toFixed(2);

    lineItems.push({
      name: 'Booking Fee',
      price: bookingFee,
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems.map(
        (item: { name: string; price: number; quantity: number }) => ({
          price_data: {
            currency: 'nzd',
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        }),
      ),
      mode: 'payment',
      success_url: 'https://www.medrevue.co.nz/success',
      cancel_url: 'https://www.medrevue.co.nz/cancel',
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    const checkoutSessionId = session.id;

    if (!checkoutSessionId) {
      throw new Error('Failed to create Stripe checkout session');
    }

    const dbOrder = new Order({
      firstName,
      lastName,
      email,
      phone,
      isStudent,
      selectedDate,
      selectedSeats,
      totalPrice: totalPriceWithFee,
      checkoutSessionId,
      paid: false,
    });
    return await dbOrder.save();
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
}

async function retrieveOrderList(): Promise<IOrder[]> {
  return await Order.find().exec();
}

async function retrieveOrderByEmail(email: string) {
  return await Order.findOne({ email: email });
}

async function retrieveOrderById(id: string): Promise<IOrder | null> {
  return await Order.findById(id).exec();
}

async function updateOrder(order: IOrder): Promise<boolean> {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: order._id },
      {
        firstName: order.firstName,
        lastName: order.lastName,
        email: order.email,
        phone: order.phone,
        isStudent: order.isStudent,
        selectedDate: order.selectedDate,
        selectedSeats: order.selectedSeats,
        totalPrice: order.totalPrice,
        // checkoutSessionId: order.checkoutSessionId,
        paid: order.paid,
      },
      { new: true },
    ).exec();
    return updatedOrder !== null;
  } catch (error) {
    console.error('Error updating order:', error);
    return false;
  }
}

async function deleteOrder(id: string): Promise<boolean> {
  try {
    const result = await Order.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting order:', error);
    return false;
  }
}

export {
  createOrder,
  retrieveOrderList,
  retrieveOrderByEmail,
  retrieveOrderById,
  updateOrder,
  deleteOrder,
};
