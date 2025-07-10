import crypto from 'node:crypto';
import QRCode from 'qrcode';
import type { IOrder } from '../models/order';

export async function sendConfirmationEmail(order: IOrder): Promise<void> {
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (!brevoApiKey) {
    console.warn('BREVO_API_KEY not set. Skipping email notification.');
    return;
  }
  const orderId = (order._id as string | { toString(): string }).toString();
  const qrCodeSecret = process.env.QRCODE_SECRET;
  if (!qrCodeSecret) {
    console.error('QRCODE_SECRET is not set. Cannot generate secure QR code.');
    return;
  }

  const hmac = crypto.createHmac('sha256', qrCodeSecret);
  hmac.update(orderId);
  const signature = hmac.digest('hex');
  const qrPayload = `${orderId}.${signature}`;

  const qrCodeDataUrl = await QRCode.toDataURL(qrPayload);
  const seats = order.selectedSeats
    .map((s) => `${s.rowLabel}${s.number}`)
    .join(', ');
  const totalPrice = new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
  }).format(order.totalPrice);

  const emailPayload = {
    sender: {
      name: 'Auckland Medical Revue',
      email: 'aucklandmedicalrevue@gmail.com',
    },
    to: [
      {
        email: order.email,
        name: `${order.firstName} ${order.lastName}`,
      },
    ],
    subject: `MedRevue Ticket Confirmation - Order #${orderId}`,
    htmlContent: `<!DOCTYPE html><html><body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;"><div style="max-width: 600px; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);"><h2 style="color: #E5CE63;">Thank you for your purchase!</h2><p><strong>Order Number:</strong> #${orderId}</p><p><strong>Show Date:</strong> ${order.selectedDate} 7:30 PM - 10:00 PM (doors will open at 6:45 PM)</p><p><strong>Location:</strong> SkyCity Theatre</p><p><strong>Seats:</strong> ${seats}</p><p><strong>Total Paid:</strong> ${totalPrice}</p><p><strong>Ticket QR Code:</strong></p><div style="margin-top: 20px; text-align: center;"><img src="${qrCodeDataUrl}" alt="Ticket QR Code" style="width: 250px; height: 250px;"/></div><hr style="margin: 20px 0;"/><p>If you have any questions, please contact us at <a href="mailto:aucklandmedicalrevue@gmail.com">aucklandmedicalrevue@gmail.com</a>.</p></div></body></html>`,
  };

  try {
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify(emailPayload),
    });
  } catch (emailError) {
    console.error('Failed to send confirmation email:', emailError);
  }
}
