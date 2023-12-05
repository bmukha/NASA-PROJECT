import mongoose from 'mongoose';

const { MONGO_URL } = process.env;

mongoose.connection.once('open', () =>
  console.log('MongoDB connection ready...')
);

mongoose.connection.on('error', (err) => console.log(err));

export const connectToDB = async () => await mongoose.connect(MONGO_URL);

export const disconnectFromDB = async () => await mongoose.connection.close();
