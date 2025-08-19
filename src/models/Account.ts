import { Schema, model } from 'mongoose';

const AccountSchema = new Schema({ 
  name: { type: String, required: true }, 
  industry: String, 
  owner: String, 
  notes: String 
}, { timestamps: true });

AccountSchema.index({ name: 'text', industry: 'text' });

export const Account = model('Account', AccountSchema);