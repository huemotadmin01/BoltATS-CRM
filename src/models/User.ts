import { Schema, model, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'Admin' | 'Recruiter' | 'Sales';

export interface IUser {
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;
}

export interface IUserMethods {
  checkPassword(pw: string): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Recruiter', 'Sales'], default: 'Recruiter' },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

UserSchema.methods.checkPassword = function (pw: string) {
  return bcrypt.compare(pw, this.passwordHash);
};

export const User = model<IUser, UserModel>('User', UserSchema);
