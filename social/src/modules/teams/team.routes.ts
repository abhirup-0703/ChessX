import { Router } from 'express';
import { createNewTeam, createTeamPost, getFeed } from './team.controller';
import { requireAuth } from '../../shared/middlewares/requireAuth';
import { upload } from '../../shared/middlewares/upload';

const router = Router();

router.use(requireAuth);

// "avatar" is the field name the frontend must use in the FormData
router.post('/', upload.single('avatar'), createNewTeam);

// "image" is the field name for the post's picture
router.post('/:teamId/posts', upload.single('image'), createTeamPost);

// Get the Instagram-style feed
router.get('/:teamId/feed', getFeed);

export default router;