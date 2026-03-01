import bcrypt from 'bcryptjs';
import { prisma } from '../../shared/db/prisma';
import { generateToken } from '../../shared/utils/jwt';

export const registerUser = async (username: string, email: string, password: string) => {
  // 1. Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] }
  });
  
  if (existingUser) {
    throw new Error('Username or email already in use');
  }

  // 2. Hash the password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // 3. Save to Neon PostgreSQL
  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
    }
  });

  // 4. Generate JWT
  const token = generateToken(user.id);

  return { user: { id: user.id, username: user.username, email: user.email }, token };
};

export const loginUser = async (email: string, password: string) => {
  // 1. Find the user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // 2. Verify password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // 3. Generate JWT
  const token = generateToken(user.id);

  return { user: { id: user.id, username: user.username, email: user.email }, token };
};