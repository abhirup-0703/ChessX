import { Router } from 'express';
import { createRoom, getRooms, addMember, getMessages } from './chat.controller';
import { requireAuth } from '../../shared/middlewares/requireAuth';

const router = Router();

router.use(requireAuth); 

router.post('/rooms', createRoom);
router.get('/rooms', getRooms);

// --- NEW ROUTES ---
router.post('/rooms/:roomId/members', addMember); // Add a user to a room
router.get('/rooms/:roomId/messages', getMessages); // Fetch message history

export default router;