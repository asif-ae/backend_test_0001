import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY as string;

export const generateToken = (user: { id: string; username: string }) => {
  try {
    return jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
      expiresIn: '1h',
    });
  } catch (error) {
    throw new Error('Token generation failed');
  }
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY) as { id: string; username: string };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
