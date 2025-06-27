import mongoose from 'mongoose';

export async function connectdb() {
  try {
    await mongoose.connect('mongodb://localhost:27017/MainEvents', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}
