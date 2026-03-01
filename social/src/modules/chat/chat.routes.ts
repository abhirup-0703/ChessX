import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../../shared/middlewares/requireAuth';
import { 
  createRoom, getRooms, getMessages,
  sendInvite, getMyInvites, handleInviteResponse,
  kickUser, promoteUser, leaveRoom, fetchRoomMembers,
  uploadChatImage
} from './chat.controller';

const router = Router();
router.use(requireAuth); 

const upload = multer({ dest: 'uploads/' });

// Room Basics
router.post('/rooms', createRoom);
router.get('/rooms', getRooms);
router.get('/rooms/:roomId/messages', getMessages);

// --- NEW MANAGEMENT ROUTES ---

// Invites
router.post('/rooms/:roomId/invites', sendInvite); // Send invite to username
router.get('/invites', getMyInvites); // Get my pending invites
router.put('/invites/:inviteId', handleInviteResponse); // Accept/Reject ({ accept: true/false })

// Member Management
router.get('/rooms/:roomId/members', fetchRoomMembers); // Get all members for the settings panel
router.delete('/rooms/:roomId/members/:userId', kickUser); // Admin kicks member
router.put('/rooms/:roomId/members/:userId/role', promoteUser); // Admin promotes member
router.delete('/rooms/:roomId/leave', leaveRoom); // User leaves room

// Image upload
router.post('/upload-image', upload.single('image'), uploadChatImage);

export default router;