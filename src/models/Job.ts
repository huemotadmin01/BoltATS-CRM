import { Schema, model } from 'mongoose';

const JobSchema = new Schema({
  title: String, 
  department: String, 
  location: String, 
  employmentType: String,
  skills: [String], 
  openings: Number, 
  status: String
}, { timestamps: true });

JobSchema.index({ title: 'text', department: 'text', location: 'text' });

export const Job = model('Job', JobSchema);