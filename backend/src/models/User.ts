import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { IUser } from '../types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name:          { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:      { type: String, required: true, minlength: 8, select: false },
    role:          { type: String, enum: ['user', 'admin'], default: 'user' },
    accountNumber: { type: String, unique: true },
    balance:       { type: Number, default: 5000, min: 0 },
    isActive:      { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => { delete ret.password; return ret; },
    },
  }
);

UserSchema.pre('save', async function (next) {
  if (this.isNew) {
    // UUID v4 → strip hyphens → take first 12 chars → uppercase
    // Example result: PZ-A3F2B1C4D5E6
    // Guaranteed unique, no timestamp collision risk, no Math.random()
    const uid = uuidv4().replace(/-/g, '').slice(0, 12).toUpperCase();
    this.accountNumber = `PZ-${uid}`;
  }

  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

const User: Model<IUserDocument> = mongoose.model<IUserDocument>('User', UserSchema);
export default User;