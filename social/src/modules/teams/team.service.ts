import { prisma } from '../../shared/db/prisma';

export const createTeam = async (name: string, description: string, creatorId: string, avatarUrl?: string) => {
  const result = await prisma.$transaction(async (tx) => {
    // 1. Create the Team
    const team = await tx.team.create({
      data: { name, description, avatarUrl },
    });

    // 2. Add creator as Team Admin
    await tx.teamMember.create({
      data: { teamId: team.id, userId: creatorId, role: 'ADMIN' },
    });

    // 3. Create the linked Chat Room for the Team
    const chatRoom = await tx.chatRoom.create({
      data: { name: `${name} General Chat`, isGroup: true, teamId: team.id, avatarUrl },
    });

    // 4. Add creator as Chat Room Admin
    await tx.chatRoomMember.create({
      data: { roomId: chatRoom.id, userId: creatorId, role: 'ADMIN' },
    });

    return team;
  });

  return result;
};

export const createPost = async (teamId: string, authorId: string, caption?: string, imageUrl?: string) => {
  return await prisma.teamPost.create({
    data: { teamId, authorId, caption, imageUrl },
    include: { author: { select: { username: true, avatarUrl: true } } }
  });
};

export const getTeamFeed = async (teamId: string) => {
  return await prisma.teamPost.findMany({
    where: { teamId },
    orderBy: { createdAt: 'desc' }, // Newest posts first
    include: {
      author: { select: { username: true, avatarUrl: true } },
      comments: {
        include: { author: { select: { username: true, avatarUrl: true } } },
        orderBy: { createdAt: 'asc' } // Oldest comments first (top to bottom)
      }
    }
  });
};