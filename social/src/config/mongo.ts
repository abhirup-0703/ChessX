import mongoose from 'mongoose';

export const connectMongo = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is missing in the .env file!');
    }

    await mongoose.connect(mongoUri);
    console.log('🍃 MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};