// Right now we are having this as mongodb, but we can store this in redis as well for faster computation

import mongoose from 'mongoose';
import { UserDoc } from './user.model';

interface SessionAttrs {
  user: UserDoc;
}

interface SessionModel extends mongoose.Model<SessionDoc> {
  build(attrs: SessionAttrs): SessionDoc;
}

export interface SessionDoc extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  valid: boolean;
}

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    valid: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

sessionSchema.statics.build = (attrs: SessionAttrs) => {
  return new Session(attrs);
};

const Session = mongoose.model<SessionDoc, SessionModel>('Session', sessionSchema);

export default Session;
