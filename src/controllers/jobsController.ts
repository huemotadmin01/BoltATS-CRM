import { Response } from 'express';
import { Job } from '../models/Job';
import { toJSON } from '../utils/toJSON';
import { parsePage } from '../utils/paginate';
import { AuthedRequest } from '../middleware/auth';

export async function list(req: AuthedRequest, res: Response) {
  try {
    const { page, limit, search } = parsePage(req);
    const skip = (page - 1) * limit;

    const filter = search ? { $text: { $search: search } } : {};
    const [data, total] = await Promise.all([
      Job.find(filter).skip(skip).limit(limit).lean(),
      Job.countDocuments(filter)
    ]);

    res.json({
      data: data.map(toJSON),
      meta: { total, page, limit }
    });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to fetch jobs' } });
  }
}

export async function create(req: AuthedRequest, res: Response) {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(toJSON(job.toObject()));
  } catch (error) {
    res.status(400).json({ error: { message: 'Failed to create job' } });
  }
}

export async function update(req: AuthedRequest, res: Response) {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!job) {
      return res.status(404).json({ error: { message: 'Job not found' } });
    }
    res.json(toJSON(job));
  } catch (error) {
    res.status(400).json({ error: { message: 'Failed to update job' } });
  }
}

export async function remove(req: AuthedRequest, res: Response) {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ error: { message: 'Job not found' } });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: { message: 'Failed to delete job' } });
  }
}