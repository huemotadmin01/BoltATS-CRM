import { Response } from 'express';
import { Opportunity } from '../models/Opportunity';
import { toJSON } from '../utils/toJSON';
import { parsePage } from '../utils/paginate';
import { AuthedRequest } from '../middleware/auth';

export async function list(req: AuthedRequest, res: Response) {
  try {
    const { page, limit, search } = parsePage(req);
    const skip = (page - 1) * limit;

    const filter = search ? { $text: { $search: search } } : {};
    const [data, total] = await Promise.all([
      Opportunity.find(filter).skip(skip).limit(limit).populate('accountId').lean(),
      Opportunity.countDocuments(filter)
    ]);

    res.json({
      data: data.map(toJSON),
      meta: { total, page, limit }
    });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to fetch opportunities' } });
  }
}

export async function create(req: AuthedRequest, res: Response) {
  try {
    const opportunity = await Opportunity.create(req.body);
    const populated = await opportunity.populate('accountId');
    res.status(201).json(toJSON(populated.toObject()));
  } catch (error) {
    res.status(400).json({ error: { message: 'Failed to create opportunity' } });
  }
}

export async function update(req: AuthedRequest, res: Response) {
  try {
    const opportunity = await Opportunity.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('accountId').lean();
    if (!opportunity) {
      return res.status(404).json({ error: { message: 'Opportunity not found' } });
    }
    res.json(toJSON(opportunity));
  } catch (error) {
    res.status(400).json({ error: { message: 'Failed to update opportunity' } });
  }
}

export async function remove(req: AuthedRequest, res: Response) {
  try {
    const opportunity = await Opportunity.findByIdAndDelete(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ error: { message: 'Opportunity not found' } });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: { message: 'Failed to delete opportunity' } });
  }
}