import { Response } from 'express';
import { Account } from '../models/Account';
import { toJSON } from '../utils/toJSON';
import { parsePage } from '../utils/paginate';
import { AuthedRequest } from '../middleware/auth';

export async function list(req: AuthedRequest, res: Response) {
  try {
    const { page, limit, search } = parsePage(req);
    const skip = (page - 1) * limit;

    const filter = search ? { $text: { $search: search } } : {};
    const [data, total] = await Promise.all([
      Account.find(filter).skip(skip).limit(limit).lean(),
      Account.countDocuments(filter)
    ]);

    res.json({
      data: data.map(toJSON),
      meta: { total, page, limit }
    });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to fetch accounts' } });
  }
}

export async function create(req: AuthedRequest, res: Response) {
  try {
    const account = await Account.create(req.body);
    res.status(201).json(toJSON(account.toObject()));
  } catch (error) {
    res.status(400).json({ error: { message: 'Failed to create account' } });
  }
}

export async function update(req: AuthedRequest, res: Response) {
  try {
    const account = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!account) {
      return res.status(404).json({ error: { message: 'Account not found' } });
    }
    res.json(toJSON(account));
  } catch (error) {
    res.status(400).json({ error: { message: 'Failed to update account' } });
  }
}

export async function remove(req: AuthedRequest, res: Response) {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);
    if (!account) {
      return res.status(404).json({ error: { message: 'Account not found' } });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: { message: 'Failed to delete account' } });
  }
}