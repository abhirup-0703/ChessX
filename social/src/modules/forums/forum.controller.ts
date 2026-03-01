import { Response } from 'express';
import { AuthenticatedRequest } from '../../shared/middlewares/requireAuth';
import * as forumService from './forum.service';

export const handleCreateCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    const category = await forumService.createCategory(name, description);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const handleGetCategories = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const categories = await forumService.getCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const handleCreateThread = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const categoryId = req.params.categoryId as string;
    const authorId = req.user?.id;
    const { title, content } = req.body;

    if (!authorId) { res.status(401).json({ error: 'Unauthorized' }); return; }

    const thread = await forumService.createThread(categoryId, authorId, title, content);
    res.status(201).json(thread);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create thread' });
  }
};

export const handleGetCategoryThreads = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const categoryId = req.params.categoryId as string;
    const threads = await forumService.getThreadsByCategory(categoryId);
    res.status(200).json(threads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch threads' });
  }
};

export const handleGetThread = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const threadId = req.params.threadId as string;
    const thread = await forumService.getThreadDetails(threadId);
    res.status(200).json(thread);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch thread details' });
  }
};

export const handleCreateReply = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const threadId = req.params.threadId as string;
    const authorId = req.user?.id;
    const { content } = req.body;

    if (!authorId) { res.status(401).json({ error: 'Unauthorized' }); return; }

    const reply = await forumService.createReply(threadId, authorId, content);
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ error: 'Failed to post reply' });
  }
};