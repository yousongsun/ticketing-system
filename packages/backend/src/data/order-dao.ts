import { type IOrder, Order } from '../models/order';

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
    const dbOrder = new Order({
      firstName,
      lastName,
      email,
      phone,
      isStudent,
      selectedDate,
      selectedSeats,
      totalPrice,
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
