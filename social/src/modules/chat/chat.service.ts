import { Message } from './message.model';
import { prisma } from '../../shared/db/prisma';

export const createChatRoom = async (creatorId: string, name?: string, isGroup: boolean = false) => {
  // We use a transaction so if adding the member fails, the room isn't created either
  const result = await prisma.$transaction(async (tx) => {
    // 1. Create the room
    const room = await tx.chatRoom.create({
      data: {
        name: isGroup ? name : null, // DMs don't strictly need a room name
        isGroup,
      },
    });

    // 2. Add the creator as an ADMIN
    await tx.chatRoomMember.create({
      data: {
        roomId: room.id,
        userId: creatorId,
        role: 'ADMIN',
      },
    });

    return room;
  });

  return result;
};

export const getUserRooms = async (userId: string) => {
  // Find all rooms where this user is a member
  return await prisma.chatRoom.findMany({
    where: {
      members: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      // Also fetch the details of the other members in the room so the frontend can display their avatars
      members: {
        include: {
          user: {
            select: { id: true, username: true, avatarUrl: true },
          },
        },
      },
    },
  });
};


export const addMemberToRoom = async (roomId: string, userIdToAdd: string, requesterId: string) => {
  // 1. Check if the requester is actually in the room AND is an Admin
  const requesterMembership = await prisma.chatRoomMember.findUnique({
    where: {
      roomId_userId: { roomId, userId: requesterId },
    },
  });

  if (!requesterMembership) {
    throw new Error('You are not a member of this room');
  }

  if (requesterMembership.role !== 'ADMIN') {
    throw new Error('Only admins can add new members to this room');
  }

  // 2. Check if the user to be added is already in the room
  const existingMember = await prisma.chatRoomMember.findUnique({
    where: {
      roomId_userId: { roomId, userId: userIdToAdd },
    },
  });

  if (existingMember) {
    throw new Error('User is already a member of this room');
  }

  // 3. Add the new member
  const newMember = await prisma.chatRoomMember.create({
    data: {
      roomId,
      userId: userIdToAdd,
      role: 'MEMBER', // They join as a standard member
    },
    include: {
      user: {
        select: { id: true, username: true, avatarUrl: true },
      },
    },
  });

  return newMember;
};

export const getRoomMessages = async (roomId: string, skip: number = 0, limit: number = 50) => {
  // Fetch messages from MongoDB, sorted by newest first
  const messages = await Message.find({ roomId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Reverse them so the frontend gets them in chronological order (oldest at top, newest at bottom)
  return messages.reverse();
};