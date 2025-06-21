import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Seat } from '../src/models/seat';
import { seedSeatData } from '../src/utils/seedSeatData';

dotenv.config();

const seedSeats = async () => {
  try {
    await mongoose.connect(
      process.env.DB_URL || 'mongodb://localhost:27017/medrevue',
    );
    console.log('✅ Connected to MongoDB');

    const seatData = seedSeatData();
    const allSeats = Object.values(seatData).flat();

    await Seat.deleteMany({});
    console.log('🗑️  Cleared existing seats');

    await Seat.insertMany(allSeats);
    console.log(`✅ Inserted ${allSeats.length} seats`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding seats:', error);
    process.exit(1);
  }
};

seedSeats();
