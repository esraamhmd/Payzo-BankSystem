import mongoose, { Schema, Document, Model } from 'mongoose';
import { ITransaction } from '../types';

export interface ITransactionDocument extends Omit<ITransaction, '_id'>, Document {}

const TransactionSchema = new Schema<ITransactionDocument>(
  {
    senderId:    { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    receiverId:  { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount:      { type: Number, required: true, min: 0.01 },
    type:        { type: String, enum: ['transfer', 'deposit', 'withdrawal'], default: 'transfer' },
    status:      { type: String, enum: ['completed', 'failed'], default: 'completed' },
    description: { type: String, trim: true, maxlength: 200, default: '' },
  },
  { timestamps: true }
);

const Transaction: Model<ITransactionDocument> = mongoose.model<ITransactionDocument>('Transaction', TransactionSchema);
export default Transaction;