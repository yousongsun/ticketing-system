import Order from '../models/order';
export async function retrieveOrder(orderID: string) {
  return await Order.findById(orderID);
}

export async function updateOrderPaid(orderID: string) {
  const filter = { _id: orderID };
  const update = { paid: true };
  const doc = await Order.findOneAndUpdate(filter, update, { new: true });
  return doc;
}

export async function createOrder(
  userID: string,
  numberOfTickets: number,
  seats: string[],
) {
  const order = new Order({
    userID,
    numberOfTickets,
    seats,
    paid: false,
  });
  return await order.save();
}
