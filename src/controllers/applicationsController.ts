import { Response } from 'express';
import { Application } from '../models/Application';
import { toJSON } from '../utils/toJSON';
import { parsePage } from '../utils/paginate';
import { AuthedRequest } from '../middleware/auth';

export async function list(req: AuthedRequest, res: Response) {
  try {
    const { page, limit, search } = parsePage(req);
    const skip = (page - 1) * limit;

    const filter = search ? { stage: { $regex: search, $options: 'i' } } : {};
    const [data, total] = await Promise.all([
      Application.find(filter).skip(skip).limit(limit).populate('candidateId jobId').lean(),
      Application.countDocuments(filter)
    ]);

    res.json({
      data: data.map(toJSON),
      meta: { total, page, limit }
    });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to fetch applications' } });
  }
}

export async function create(req: AuthedRequest, res: Response) {
  try {
    const application = await Application.create(req.body);
    const populated = await application.populate('candidateId jobId');
    res.status(201).json(toJSON(populated.toObject()));
  } catch (error) {
    res.status(400).json({ error: { message: 'Failed to create application' } });
  }
}

export async function update(req: AuthedRequest, res: Response) {
  try {
    const application = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('candidateId jobId').lean();
    if (!application) {
      return res.status(404).json({ error: { message: 'Application not found' } });
    }
    res.json(toJSON(application));
  } catch (error) {
    res.status(400).json({ error: { message: 'Failed to update application' } });
  }
}

export async function remove(req: AuthedRequest, res: Response) {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ error: { message: 'Application not found' } });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: { message: 'Failed to delete application' } });
  }
}

export async function move(req: AuthedRequest, res: Response) {
  try {
    const { toStage, notes } = req.body;
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ error: { message: 'Application not found' } });
    }

    const fromStage = application.stage;
    application.stage = toStage;
    application.stageHistory.push({
      from: fromStage,
      to: toStage,
      at: new Date(),
      notes: notes || ''
    });

    await application.save();
    const populated = await application.populate('candidateId jobId');
    res.json(toJSON(populated.toObject()));
  } catch (error) {
    res.status(400).json({ error: { message: 'Failed to move application stage' } });
  }
}