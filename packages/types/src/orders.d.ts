export interface OrderType {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isStudent: boolean;
  selectedDate: string;
  selectedSeats: {
    rowLabel: string;
    number: number;
    seatType: 'Standard' | 'VIP';
  }[];
  totalPrice: number;
  paid: boolean;
}
