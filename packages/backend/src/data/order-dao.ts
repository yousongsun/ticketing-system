import Order from '../models/order';
export async function retrieveOrder(email: string) {
  return await Order.findOne({ email: email });
}

export async function updateOrderPaid(email: string) {
  const filter = { email: email };
  const update = { paid: true };
  const doc = await Order.findOneAndUpdate(filter, update, { new: true });
  return doc;
}

export async function createOrder(
  email: string,
  numberOfTickets: number,
  seats: string[],
) {
  const order = new Order({
    email,
    numberOfTickets,
    seats,
    paid: false,
  });
  return await order.save();
}
