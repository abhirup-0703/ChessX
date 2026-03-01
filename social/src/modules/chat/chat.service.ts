import { Message } from './message.model';
import { prisma } from '../../shared/db/prisma';
export const createChatRoom = async (creatorId: string, name?: string, isGroup: boolean = false) => {
  // Prisma automatically wraps nested creates in a database transaction!
  return await prisma.chatRoom.create({
    data: {
      name: isGroup ? name : null,
      isGroup,
      members: {
        create: {
          userId: creatorId,
          role: 'ADMIN',
        },
      },
    },
    // Now we explicitly tell Prisma: "When you return the new room, include the members array!"
    include: {
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


// 1. Send an Invite by Username
export const inviteUserByUsername = async (roomId: string, inviterId: string, targetUsername: string) => {
  // Check if inviter is an ADMIN
  const inviterMembership = await prisma.chatRoomMember.findUnique({
    where: { roomId_userId: { roomId, userId: inviterId } },
  });

  if (!inviterMembership || inviterMembership.role !== 'ADMIN') {
    throw new Error('Only admins can invite people to this room');
  }

  // Find the target user
  const targetUser = await prisma.user.findUnique({ where: { username: targetUsername } });
  if (!targetUser) throw new Error('User not found');

  // Check if they are already in the room
  const existingMember = await prisma.chatRoomMember.findUnique({
    where: { roomId_userId: { roomId, userId: targetUser.id } },
  });
  if (existingMember) throw new Error('User is already in this room');

  // Create or update the invite (upsert prevents duplicate pending invites)
  return await prisma.chatInvite.upsert({
    where: { roomId_inviteeId: { roomId, inviteeId: targetUser.id } },
    update: { status: 'PENDING', inviterId }, // Reset to pending if previously rejected
    create: { roomId, inviterId, inviteeId: targetUser.id, status: 'PENDING' },
  });
};

// 2. Get Pending Invites for a User
export const getPendingInvites = async (userId: string) => {
  return await prisma.chatInvite.findMany({
    where: { inviteeId: userId, status: 'PENDING' },
    include: {
      room: { select: { id: true, name: true, avatarUrl: true } },
      inviter: { select: { username: true, avatarUrl: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

// 3. Respond to an Invite (Accept/Reject)
export const respondToInvite = async (inviteId: string, userId: string, accept: boolean) => {
  const invite = await prisma.chatInvite.findUnique({ where: { id: inviteId } });
  if (!invite || invite.inviteeId !== userId) throw new Error('Invite not found or unauthorized');
  if (invite.status !== 'PENDING') throw new Error('Invite already processed');

  if (!accept) {
    return await prisma.chatInvite.update({
      where: { id: inviteId },
      data: { status: 'REJECTED' },
    });
  }

  // If accepting, we use a transaction to update the invite AND add them to the room
  return await prisma.$transaction(async (tx) => {
    await tx.chatInvite.update({
      where: { id: inviteId },
      data: { status: 'ACCEPTED' },
    });

    return await tx.chatRoomMember.create({
      data: { roomId: invite.roomId, userId: userId, role: 'MEMBER' },
    });
  });
};

// 4. Admin Action: Kick Member
export const kickMember = async (roomId: string, adminId: string, targetUserId: string) => {
  const admin = await prisma.chatRoomMember.findUnique({ where: { roomId_userId: { roomId, userId: adminId } } });
  if (!admin || admin.role !== 'ADMIN') throw new Error('Only admins can kick members');
  if (adminId === targetUserId) throw new Error('You cannot kick yourself. Use the leave function instead.');

  return await prisma.chatRoomMember.delete({
    where: { roomId_userId: { roomId, userId: targetUserId } },
  });
};

// 5. Admin Action: Promote Member
export const promoteMember = async (roomId: string, adminId: string, targetUserId: string) => {
  const admin = await prisma.chatRoomMember.findUnique({ where: { roomId_userId: { roomId, userId: adminId } } });
  if (!admin || admin.role !== 'ADMIN') throw new Error('Only admins can promote members');

  return await prisma.chatRoomMember.update({
    where: { roomId_userId: { roomId, userId: targetUserId } },
    data: { role: 'ADMIN' },
  });
};

// 6. User Action: Leave Room
export const leaveRoom = async (roomId: string, userId: string) => {
  return await prisma.chatRoomMember.delete({
    where: { roomId_userId: { roomId, userId } },
  });
};

// 7. Get Room Members (For the Settings Panel)
export const getRoomMembers = async (roomId: string) => {
  return await prisma.chatRoomMember.findMany({
    where: { roomId },
    include: { user: { select: { id: true, username: true, avatarUrl: true } } },
    orderBy: { role: 'asc' }, // Puts ADMINs at the top
  });
};