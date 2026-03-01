import { Request, Response } from 'express';
import * as authService from './auth.service';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      res.status(400).json({ error: 'Please provide all fields' });
      return;
    }

    const data = await authService.registerUser(username, email, password);
    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Please provide email and password' });
      return;
    }

    const data = await authService.loginUser(email, password);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // If you were using HttpOnly cookies, you would clear it here like this:
    // res.clearCookie('token');

    // Since we are sending the token in the JSON payload for the frontend to manage,
    // we just send a success message to confirm the action.
    res.status(200).json({ message: 'Successfully logged out. Please remove the token on the client side.' });
  } catch (error: any) {
    res.status(500).json({ error: 'Something went wrong during logout' });
  }
};