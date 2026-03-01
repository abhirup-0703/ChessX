import { Response } from 'express';
import { AuthenticatedRequest } from '../../shared/middlewares/requireAuth';
import * as teamService from './team.service';

export const createNewTeam = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { name, description } = req.body;
    const avatarUrl = req.file?.path; // Provided by Cloudinary middleware

    if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return; }
    if (!name) { res.status(400).json({ error: 'Team name is required' }); return; }

    const team = await teamService.createTeam(name, description, userId, avatarUrl);
    res.status(201).json(team);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create team. Name might be taken.' });
  }
};

export const createTeamPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const teamId = req.params.teamId as string;
    const { caption } = req.body;
    const imageUrl = req.file?.path; // The uploaded image URL

    if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return; }
    if (!imageUrl && !caption) { res.status(400).json({ error: 'Post must have an image or a caption' }); return; }

    const post = await teamService.createPost(teamId, userId, caption, imageUrl);
    res.status(201).json(post);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const getFeed = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const teamId = req.params.teamId as string;
    const feed = await teamService.getTeamFeed(teamId);
    
    res.status(200).json(feed);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch team feed' });
  }
};