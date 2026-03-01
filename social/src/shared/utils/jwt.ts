import jwt from 'jsonwebtoken';

// Make sure to add JWT_SECRET="your_secret_key" to your .env file!
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' }); // Token lasts for 7 days
};