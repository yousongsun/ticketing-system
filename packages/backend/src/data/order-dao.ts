import { type IOrder, Order } from '../models/order';

async function createOrder(
  email: string,
  dateOfShow: string,
  numberOfTickets: number,
  seats: string[],
) {
  try {
    const dbOrder = new Order({
      email,
      dateOfShow,
      numberOfTickets,
      seats,
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
        email: order.email,
        dateOfShow: order.dateOfShow,
        numberOfTickets: order.numberOfTickets,
        seats: order.seats,
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

async function updateOrderPaid(email: string) {
  const filter = { email: email };
  const update = { paid: true };
  const doc = await Order.findOneAndUpdate(filter, update, { new: true });
  return doc;
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
  updateOrderPaid,
  deleteOrder,
};
