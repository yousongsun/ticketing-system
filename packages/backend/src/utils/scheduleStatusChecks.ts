export function scheduleStatusChecks(orderId: string): void {
  const baseUrl =
    process.env.API_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;

  const checkStatus = async () => {
    try {
      await fetch(`${baseUrl}/api/v1/orders/order-status/${orderId}`);
    } catch (err) {
      console.error(`Status check failed for order ${orderId}:`, err);
    }
  };

  for (const minutes of [10, 20, 30, 40, 50]) {
    setTimeout(checkStatus, minutes * 60 * 1000);
  }
}
