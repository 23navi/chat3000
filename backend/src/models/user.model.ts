import mongoose from 'mongoose';
import { Password } from '../utils/password';

// We will assume that when we are creating doc, we validated user input using zod, so we will not go crazy with mongoose validation

// An interface that describes the properties
// that are requried to create a new User

// think this as create user attribute, and we can exten this, use partial and omit to set the update user schema
export interface UserAttrs {
  email: string;
  password: string;
  name: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties (TS Schema)
// that a User Document has
export interface UserDoc extends mongoose.Document {
  email: string;
  username: string;
  password: string;
  passwordLastModified: Date;
  name: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  verificationOTP: number;
  verificationOTPExpiration: Date;
  passwordChangeOTP: number;
  passwordChangeOTPExpiration: Date;
  passwordChangedAt: Date;
}

// This is the schema for the User but not the typescript schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    avatar: {
      url: String,
      public_id: String,
    },
  },
  {
    // This will remove __v and password from the return of user, when we do user.toJson()
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
    },
    timestamps: true,
  },
);

userSchema.pre<UserDoc>('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export default User;
