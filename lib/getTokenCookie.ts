import cookieOptions from './cookieOptions';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export default function getTokenCookie(userId: string) {
  if (!process.env.JWT_SECRET) {
    return '';
  }

  return serialize(
    'token',
    jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    ),
    cookieOptions(),
  );
}