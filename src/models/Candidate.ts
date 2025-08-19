import { Schema, model } from 'mongoose';

const CandidateSchema = new Schema({
  name: String, 
  email: { type: String, unique: true, index: true }, 
  phone: String,
  skills: [String], 
  experienceYears: Number, 
  currentTitle: String, 
  currentCompany: String, 
  tags: [String]
}, { timestamps: true });

CandidateSchema.index({ name: 'text', email: 'text', skills: 'text' });

export const Candidate = model('Candidate', CandidateSchema);