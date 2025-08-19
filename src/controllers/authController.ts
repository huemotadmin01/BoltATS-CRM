import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { toJSON } from '../utils/toJSON';
import { config } from '../config/env';
import { AuthedRequest } from '../middleware/auth';

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: { message: 'Email and password are required' } });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    const userObj = toJSON(user.toObject());
    delete userObj.passwordHash;

    const token = jwt.sign(
      { id: userObj.id, email: userObj.email, role: userObj.role },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({ user: userObj, token });
  } catch (error) {
    res.status(500).json({ error: { message: 'Login failed' } });
  }
}

export async function me(req: AuthedRequest, res: Response) {
  try {
    const user = await User.findById(req.user!.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    const userObj = toJSON(user.toObject());
    res.json({ user: userObj });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to get user profile' } });
  }
}