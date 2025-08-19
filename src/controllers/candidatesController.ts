import { Response } from 'express';
import { Candidate } from '../models/Candidate';
import { toJSON } from '../utils/toJSON';
import { parsePage } from '../utils/paginate';
import { AuthedRequest } from '../middleware/auth';

export async function list(req: AuthedRequest, res: Response) {
  try {
    const { page, limit, search } = parsePage(req);
    const skip = (page - 1) * limit;

    const filter = search ? { $text: { $search: search } } : {};
    const [data, total] = await Promise.all([
      Candidate.find(filter).skip(skip).limit(limit).lean(),
      Candidate.countDocuments(filter)
    ]);

    res.json({
      data: data.map(toJSON),
      meta: { total, page, limit }
    });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to fetch candidates' } });
  }
}

export async function create(req: AuthedRequest, res: Response) {
  try {
    const candidate = await Candidate.create(req.body);
    res.status(201).json(toJSON(candidate.toObject()));
  } catch (error) {
    res.status(400).json({ error: { message: 'Failed to create candidate' } });
  }
}

export async function update(req: AuthedRequest, res: Response) {
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!candidate) {
      return res.status(404).json({ error: { message: 'Candidate not found' } });
    }
    res.json(toJSON(candidate));
  } catch (error) {
    res.status(400).json({ error: { message: 'Failed to update candidate' } });
  }
}

export async function remove(req: AuthedRequest, res: Response) {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ error: { message: 'Candidate not found' } });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: { message: 'Failed to delete candidate' } });
  }
}