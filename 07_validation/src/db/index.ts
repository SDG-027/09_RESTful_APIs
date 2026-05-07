import mongoose from 'mongoose';

export default async function initDB() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error('MongoDB Connection String missing');

    const result = await mongoose.connect(mongoUri, { dbName: 'blog' });

    console.log(`\x1b[35mSucessfully connected to DB: ${result.connection.name}\x1b[0m`);
  } catch (error) {
    console.log(error);
  }
}
