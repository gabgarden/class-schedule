import dotenv from 'dotenv';
import mongoose from 'mongoose';

export default async function Main() {
  dotenv.config();

  try {
    mongoose.set('strictQuery', true);

    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=1stCluster`
    );

    console.log('Connection established');
  } catch (err) {
    console.log(err);
  }
}
