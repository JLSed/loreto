import 'server-only'

import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUD_NAME;
const apiKey = process.env.CLOUD_KEY;
const apiSecret = process.env.CLOUD_SECRET;

if (!cloudName) {
  throw new Error('CLOUD_NAME is not set in .env file');
}
if (!apiKey) {
  throw new Error('CLOUD_KEY is not set in .env file');
}
if (!apiSecret) {
  throw new Error('CLOUD_SECRET is not set in .env file');
}


cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export const cloud = cloudinary;
