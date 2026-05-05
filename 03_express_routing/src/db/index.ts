import mongoose from 'mongoose';

export default async function initDB() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error('MongoDB Connection String missing');

    const result = await mongoose.connect(mongoUri, { dbName: 'posts' });

    console.log(`Sucessfully connected to DB: ${result.connection.name}`);
  } catch (error) {
    console.log(error);
  }
}
