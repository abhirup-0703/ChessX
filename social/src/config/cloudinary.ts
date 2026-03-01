import { v2 as cloudinary } from 'cloudinary';

// Ensure you add these 3 variables to your .env file!
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const verifyCloudinary = async (): Promise<void> => {
  try {
    // Ping the Cloudinary API. If credentials are bad, this throws an error.
    await cloudinary.api.ping();
    console.log('☁️  Cloudinary configured and verified successfully');
  } catch (error) {
    console.error('❌ Cloudinary verification failed. Check your .env credentials!', error);
    // process.exit(1); // Optional: uncomment if you want the server to crash on bad keys
  }
};


export default cloudinary;