import { Response, NextFunction } from 'express';
import User from '../models/User';
import Transaction from '../models/Transaction';
import { AuthRequest, ApiResponse } from '../types';

export const getAllUsers = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: 'Users retrieved.', data: { users, count: users.length } } as ApiResponse);
  } catch (error) { next(error); }
};

export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { isActive, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...(isActive !== undefined && { isActive }), ...(role && { role }) },
      { new: true, runValidators: true }
    );
    if (!user) { res.status(404).json({ success: false, message: 'User not found.' } as ApiResponse); return; }
    res.status(200).json({ success: true, message: `User ${user.isActive ? 'activated' : 'suspended'} successfully.`, data: { user } } as ApiResponse);
  } catch (error) { next(error); }
};

export const getAllTransactions = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const transactions = await Transaction.find()
      .populate('senderId',   'name email accountNumber')
      .populate('receiverId', 'name email accountNumber')
      .sort({ createdAt: -1 }).limit(200);
    res.status(200).json({ success: true, message: 'Transactions retrieved.', data: { transactions } } as ApiResponse);
  } catch (error) { next(error); }
};

export const getStats = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalUsers     = await User.countDocuments({ role: 'user' });
    const activeUsers    = await User.countDocuments({ role: 'user', isActive: true });
    const totalTx        = await Transaction.countDocuments();
    const volumeResult   = await Transaction.aggregate([{ $match: { type: 'transfer', status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
    const balanceResult  = await User.aggregate([{ $group: { _id: null, total: { $sum: '$balance' } } }]);
    res.status(200).json({
      success: true, message: 'Stats retrieved.',
      data: {
        totalUsers, activeUsers, suspendedUsers: totalUsers - activeUsers,
        totalTransactions: totalTx,
        totalVolume: volumeResult[0]?.total   || 0,
        totalBalances: balanceResult[0]?.total || 0,
      },
    } as ApiResponse);
  } catch (error) { next(error); }
};