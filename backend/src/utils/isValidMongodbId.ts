// We can use this helper functin for zod custom validation using refine
import mongoose from 'mongoose';
const isValidMongodbId = (id: string) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export default isValidMongodbId;
