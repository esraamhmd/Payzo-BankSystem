import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { signToken, COOKIE_OPTIONS } from '../config/jwt';
import { AuthRequest, ApiResponse } from '../types';
import { RegisterInput, LoginInput } from '../utils/validation';

export const register = async (req: Request<{}, {}, RegisterInput>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) { res.status(409).json({ success: false, message: 'Email already registered.' } as ApiResponse); return; }
    const user = await User.create({ name, email, password });
    const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role });
    res.cookie('token', token, COOKIE_OPTIONS);
    res.status(201).json({ success: true, message: `Welcome to Payzo, ${user.name}! Your account is ready.`, data: { user } } as ApiResponse);
  } catch (error) { next(error); }
};

export const login = async (req: Request<{}, {}, LoginInput>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' } as ApiResponse); return;
    }
    if (!user.isActive) {
      res.status(403).json({ success: false, message: 'Your account is suspended. Contact support.' } as ApiResponse); return;
    }
    const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role });
    res.cookie('token', token, COOKIE_OPTIONS);
    res.status(200).json({ success: true, message: `Welcome back, ${user.name}!`, data: { user } } as ApiResponse);
  } catch (error) { next(error); }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('token', { path: '/' });
  res.status(200).json({ success: true, message: 'Logged out successfully.' } as ApiResponse);
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) { res.status(404).json({ success: false, message: 'User not found.' } as ApiResponse); return; }
    res.status(200).json({ success: true, message: 'Profile retrieved.', data: { user } } as ApiResponse);
  } catch (error) { next(error); }
};