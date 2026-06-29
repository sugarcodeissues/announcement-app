import 'dotenv/config';
import mongoose from 'mongoose';

console.log('MONGODB_URI loaded:', !!process.env.MONGODB_URI);

try {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log('✅ MongoDB Connected Successfully');
  process.exit(0);
} catch (err) {
  console.error('❌ Connection Error:');
  console.error(err);
  process.exit(1);
}