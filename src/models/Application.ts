import { Schema, model, Types } from 'mongoose';

const StageHistory = new Schema({ 
  from: String, 
  to: String, 
  at: { type: Date, default: Date.now }, 
  notes: String 
}, { _id: false });

const ApplicationSchema = new Schema({
  candidateId: { type: Types.ObjectId, ref: 'Candidate', required: true },
  jobId: { type: Types.ObjectId, ref: 'Job', required: true },
  stage: { type: String, enum: ['New', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'], default: 'New' },
  stageHistory: [StageHistory],
  notes: String
}, { timestamps: true });

export const Application = model('Application', ApplicationSchema);