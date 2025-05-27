import mongoose from 'mongoose';

export const connectToMongodb = async (connectionURI: string) => {
  try {
    await mongoose.connect(connectionURI);
    console.log('Chat3000 Service: Connected to MongoDb');
  } catch (err) {
    console.log('Cannot connect to MongoDb for Chat3000 System');
    // console.error(err);
  }
};
