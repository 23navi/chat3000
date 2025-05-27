import * as dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

const envPath = `.env.${
  process.env.NODE_ENV === 'production' ? 'production' : process.env.NODE_ENV === 'staging' ? 'staging' : 'development'
}`;
dotenv.config({ path: path.resolve(envPath) });

const envSchema = z.object({
  PORT: z.string().min(1),
  MONGO_URI: z.string().min(1),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_SECRET_KEY: z.string().min(1),
  CORS_ORIGIN_LIST: z.string().min(1),
  NODE_ENV: z.enum(['production', 'development', 'staging']).default('development'),
  SMTP_PASSWORD: z.string().min(1),
  SMTP_USER: z.string().min(1),
  JWT_VALIDATION_SECRET: z.string().min(1),
  accessTokenPublicKey: z.string().min(1),
  accessTokenPrivateKey: z.string().min(1),
  refreshTokenPublicKey: z.string().min(1),
  refreshTokenPrivateKey: z.string().min(1),
});

const env = envSchema.parse(process.env);

export const {
  PORT,
  MONGO_URI,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET_KEY,
  CORS_ORIGIN_LIST,
  NODE_ENV,
  SMTP_PASSWORD,
  SMTP_USER,
  JWT_VALIDATION_SECRET,
  accessTokenPublicKey,
  accessTokenPrivateKey,
  refreshTokenPublicKey,
  refreshTokenPrivateKey,
} = env;

export const MAX_FIND_LIMIT = 100_000;
