import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true, index: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Recruiter', 'Sales'], default: 'Admin' },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

UserSchema.methods.checkPassword = function (password: string) {
  return bcrypt.compare(password, this.passwordHash);
};

export const User = model('User', UserSchema);