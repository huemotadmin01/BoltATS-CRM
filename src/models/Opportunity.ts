import { Schema, model, Types } from 'mongoose';

const OpportunitySchema = new Schema({
  accountId: { type: Types.ObjectId, ref: 'Account', required: true },
  title: String,
  stage: { type: String, enum: ['Prospect', 'Qualified', 'Won', 'Lost'], default: 'Prospect' },
  value: { type: Number, default: 0 },
  probability: Number
}, { timestamps: true });

OpportunitySchema.index({ title: 'text' });

export const Opportunity = model('Opportunity', OpportunitySchema);