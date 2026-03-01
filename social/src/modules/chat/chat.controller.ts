import { Response } from 'express';
import { AuthenticatedRequest } from '../../shared/middlewares/requireAuth';
import * as chatService from './chat.service';
import { v2 as cloudinary } from 'cloudinary';

export const createRoom = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { name, isGroup } = req.body;

    const room = await chatService.createChatRoom(userId, name, isGroup);
    res.status(201).json(room);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create chat room' });
  }
};

export const getRooms = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const rooms = await chatService.getUserRooms(userId);
    res.status(200).json(rooms);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};


export const addMember = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const requesterId = req.user?.id;
    const roomId = req.params.roomId as string;
    const { userIdToAdd } = req.body;

    if (!requesterId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!userIdToAdd) {
      res.status(400).json({ error: 'Please provide the user ID to add' });
      return;
    }

    const newMember = await chatService.addMemberToRoom(roomId, userIdToAdd, requesterId);
    res.status(201).json({ message: 'User added successfully', member: newMember });
  } catch (error: any) {
    res.status(403).json({ error: error.message });
  }
};

export const getMessages = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const roomId = req.params.roomId as string;
    const skip = parseInt(req.query.skip as string) || 0;
    const limit = parseInt(req.query.limit as string) || 50;

    // Optional Security: You could add a check here to ensure req.user.id is actually a member of roomId before fetching messages

    const messages = await chatService.getRoomMessages(roomId, skip, limit);
    res.status(200).json(messages);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};


// ... existing controllers ...

export const sendInvite = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { roomId } = req.params;
    const { username } = req.body;
    const inviterId = req.user!.id;
    const invite = await chatService.inviteUserByUsername(roomId, inviterId, username);
    res.status(201).json({ message: 'Invite sent', invite });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};

export const getMyInvites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const invites = await chatService.getPendingInvites(req.user!.id);
    res.status(200).json(invites);
  } catch (error: any) { res.status(500).json({ error: 'Failed to fetch invites' }); }
};

export const handleInviteResponse = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { inviteId } = req.params;
    const { accept } = req.body; // boolean
    await chatService.respondToInvite(inviteId, req.user!.id, accept);
    res.status(200).json({ message: accept ? 'Joined room' : 'Invite rejected' });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};

export const kickUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { roomId, userId } = req.params;
    await chatService.kickMember(roomId, req.user!.id, userId);
    res.status(200).json({ message: 'User kicked' });
  } catch (error: any) { res.status(403).json({ error: error.message }); }
};

export const promoteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { roomId, userId } = req.params;
    await chatService.promoteMember(roomId, req.user!.id, userId);
    res.status(200).json({ message: 'User promoted to Admin' });
  } catch (error: any) { res.status(403).json({ error: error.message }); }
};

export const leaveRoom = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { roomId } = req.params;
    await chatService.leaveRoom(roomId, req.user!.id);
    res.status(200).json({ message: 'Left room' });
  } catch (error: any) { res.status(400).json({ error: error.message }); }
};

export const fetchRoomMembers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { roomId } = req.params;
    const members = await chatService.getRoomMembers(roomId);
    res.status(200).json(members);
  } catch (error: any) { res.status(500).json({ error: 'Failed to fetch members' }); }
};

export const uploadChatImage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });

    // Cloudinary automatically handles the cropping/resizing if we pass transformations
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'chat_images',
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' }, // Prevents massive files
        { quality: 'auto' }
      ]
    });

    res.status(200).json({ imageUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: 'Image upload failed' });
  }
};