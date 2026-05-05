import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import Transaction from '../models/Transaction';
import { AuthRequest, ApiResponse } from '../types';
import { TransferInput, DepositInput, WithdrawInput } from '../utils/validation';

// GET /api/transactions
export const getMyTransactions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const page  = parseInt(req.query.page  as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip  = (page - 1) * limit;

    const transactions = await Transaction.find({ $or: [{ senderId: userId }, { receiverId: userId }] })
      .populate('senderId',   'name accountNumber')
      .populate('receiverId', 'name accountNumber')
      .sort({ createdAt: -1 })
      .skip(skip).limit(limit);

    const total = await Transaction.countDocuments({ $or: [{ senderId: userId }, { receiverId: userId }] });

    res.status(200).json({
      success: true, message: 'Transactions retrieved.',
      data: { transactions, total, page, pages: Math.ceil(total / limit) },
    } as ApiResponse);
  } catch (error) { next(error); }
};

// GET /api/transactions/summary
export const getSummary = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user?.userId);
    const user   = await User.findById(userId);
    if (!user) { res.status(404).json({ success: false, message: 'User not found.' } as ApiResponse); return; }

    const [sentResult, receivedResult, depositResult, withdrawResult] = await Promise.all([
      Transaction.aggregate([{ $match: { senderId: userId, type: 'transfer', status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Transaction.aggregate([{ $match: { receiverId: userId, type: 'transfer', status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Transaction.aggregate([{ $match: { receiverId: userId, type: 'deposit',  status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Transaction.aggregate([{ $match: { senderId:  userId, type: 'withdrawal', status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    ]);

    const recentTransactions = await Transaction.find({ $or: [{ senderId: userId }, { receiverId: userId }] })
      .populate('senderId', 'name accountNumber')
      .populate('receiverId', 'name accountNumber')
      .sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true, message: 'Summary retrieved.',
      data: {
        balance: user.balance,
        accountNumber: user.accountNumber,
        name: user.name,
        totalSent:      sentResult[0]?.total     || 0,
        totalReceived:  receivedResult[0]?.total  || 0,
        totalDeposited: depositResult[0]?.total   || 0,
        totalWithdrawn: withdrawResult[0]?.total  || 0,
        recentTransactions,
      },
    } as ApiResponse);
  } catch (error) { next(error); }
};

// POST /api/transactions/transfer
export const transfer = async (req: AuthRequest & { body: TransferInput }, res: Response, next: NextFunction): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { receiverAccountNumber, amount, description } = req.body;
    const sender = await User.findById(req.user?.userId).session(session);
    if (!sender) { await session.abortTransaction(); res.status(404).json({ success: false, message: 'Sender not found.' } as ApiResponse); return; }
    if (sender.balance < amount) { await session.abortTransaction(); res.status(400).json({ success: false, message: `Insufficient balance. Your balance is $${sender.balance.toFixed(2)}.` } as ApiResponse); return; }
    const receiver = await User.findOne({ accountNumber: receiverAccountNumber }).session(session);
    if (!receiver) { await session.abortTransaction(); res.status(404).json({ success: false, message: 'Receiver account not found. Check the account number.' } as ApiResponse); return; }
    if (sender._id.toString() === receiver._id.toString()) { await session.abortTransaction(); res.status(400).json({ success: false, message: 'Cannot transfer to your own account.' } as ApiResponse); return; }
    if (!receiver.isActive) { await session.abortTransaction(); res.status(400).json({ success: false, message: 'Receiver account is suspended.' } as ApiResponse); return; }

    sender.balance   -= amount;
    receiver.balance += amount;
    await sender.save({ session });
    await receiver.save({ session });

    const [tx] = await Transaction.create([{
      senderId: sender._id, receiverId: receiver._id,
      amount, type: 'transfer', status: 'completed',
      description: description || `Transfer to ${receiver.name}`,
    }], { session });

    await session.commitTransaction();
    res.status(201).json({
      success: true, message: ` $${amount.toFixed(2)} sent to ${receiver.name} successfully!`,
      data: { transaction: tx, newBalance: sender.balance },
    } as ApiResponse);
  } catch (error) { await session.abortTransaction(); next(error); }
  finally { session.endSession(); }
};

// POST /api/transactions/deposit
export const deposit = async (req: AuthRequest & { body: DepositInput }, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user?.userId);
    if (!user) { res.status(404).json({ success: false, message: 'User not found.' } as ApiResponse); return; }
    user.balance += amount;
    await user.save();
    await Transaction.create({ senderId: user._id, receiverId: user._id, amount, type: 'deposit', status: 'completed', description: 'Deposit' });
    res.status(200).json({ success: true, message: ` $${amount.toFixed(2)} deposited successfully!`, data: { newBalance: user.balance } } as ApiResponse);
  } catch (error) { next(error); }
};

// POST /api/transactions/withdraw
export const withdraw = async (req: AuthRequest & { body: WithdrawInput }, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user?.userId);
    if (!user) { res.status(404).json({ success: false, message: 'User not found.' } as ApiResponse); return; }
    if (user.balance < amount) { res.status(400).json({ success: false, message: `Insufficient balance. Your balance is $${user.balance.toFixed(2)}.` } as ApiResponse); return; }
    user.balance -= amount;
    await user.save();
    await Transaction.create({ senderId: user._id, receiverId: user._id, amount, type: 'withdrawal', status: 'completed', description: 'Withdrawal' });
    res.status(200).json({ success: true, message: ` $${amount.toFixed(2)} withdrawn successfully!`, data: { newBalance: user.balance } } as ApiResponse);
  } catch (error) { next(error); }
};