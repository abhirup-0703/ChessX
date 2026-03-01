import { Router } from 'express';
import { requireAuth } from '../../shared/middlewares/requireAuth';
import {
  handleCreateCategory,
  handleGetCategories,
  handleCreateThread,
  handleGetCategoryThreads,
  handleGetThread,
  handleCreateReply
} from './forum.controller';

const router = Router();

router.use(requireAuth);

// Categories
router.post('/categories', handleCreateCategory);
router.get('/categories', handleGetCategories);

// Threads within a category
router.post('/categories/:categoryId/threads', handleCreateThread);
router.get('/categories/:categoryId/threads', handleGetCategoryThreads);

// Specific thread details and replies
router.get('/threads/:threadId', handleGetThread);
router.post('/threads/:threadId/replies', handleCreateReply);

export default router;