import { Response } from 'express';
import { AuthenticatedRequest } from '../../shared/middlewares/requireAuth';
import * as chatService from './chat.service';

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