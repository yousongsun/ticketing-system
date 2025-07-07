import dotenv from 'dotenv';
import Stripe from 'stripe';
import { type IOrder, Order } from '../models/order';

dotenv.config();
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) throw new Error('Missing STRIPE_SECRET_KEY in environment');

const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-05-28.basil',
});

const baseFrontendUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5173'
    : 'https://www.medrevue.co.nz';

async function createOrder(
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  isStudent: boolean,
  studentCount: number,
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
    const standardStudentPrice = 25;
    const standardPrice = 35;
    let remainingStudent = Math.min(
      studentCount,
      selectedSeats.filter((s) => s.seatType === 'Standard').length,
    );
    const lineItems = selectedSeats.map((seat) => {
      let price = vipPrice;
      if (seat.seatType === 'Standard') {
        if (remainingStudent > 0) {
          price = standardStudentPrice;
          remainingStudent -= 1;
        } else {
          price = standardPrice;
        }
      }
      return {
        name: `MedRevue Ticket (${seat.seatType}) - Row ${seat.rowLabel} Seat ${seat.number}`,
        price,
        quantity: 1,
      };
    });

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
      success_url: `${baseFrontendUrl}/success`,
      cancel_url: `${baseFrontendUrl}/cancel`,
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
      studentCount,
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
        studentCount: order.studentCount,
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
