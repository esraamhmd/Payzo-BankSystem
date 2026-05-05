import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';


const JWT_SECRET     = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

if (!JWT_SECRET) {
  console.error('\n  ❌  FATAL ERROR: JWT_SECRET is not set in your .env file.\n');
  
  process.exit(1);
}

if (!JWT_EXPIRES_IN) {
  console.error('\n  ❌  FATAL ERROR: JWT_EXPIRES_IN is not set in your .env file.\n');
 
  process.exit(1);
}


const signOptions: jwt.SignOptions = {
  expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
};

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, signOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
export const COOKIE_OPTIONS = {
  httpOnly: true,                                
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,                   
  maxAge: 7 * 24 * 60 * 60 * 1000,              
  path: '/',
};