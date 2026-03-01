import { prisma } from '../../shared/db/prisma';

export const createCategory = async (name: string, description?: string) => {
  return await prisma.forumCategory.create({
    data: { name, description },
  });
};

export const getCategories = async () => {
  return await prisma.forumCategory.findMany({
    include: {
      _count: { select: { threads: true } } // Gets a quick count of how many threads are in each category
    }
  });
};

export const createThread = async (categoryId: string, authorId: string, title: string, content: string) => {
  return await prisma.forumThread.create({
    data: { categoryId, authorId, title, content },
  });
};

export const getThreadsByCategory = async (categoryId: string) => {
  return await prisma.forumThread.findMany({
    where: { categoryId },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { username: true, avatarUrl: true } },
      _count: { select: { replies: true } }
    },
  });
};

export const getThreadDetails = async (threadId: string) => {
  // We also increment the view count every time someone fetches the thread details!
  return await prisma.forumThread.update({
    where: { id: threadId },
    data: { views: { increment: 1 } },
    include: {
      author: { select: { username: true, avatarUrl: true } },
      replies: {
        orderBy: { createdAt: 'asc' }, // Oldest replies first
        include: { author: { select: { username: true, avatarUrl: true } } }
      }
    }
  });
};

export const createReply = async (threadId: string, authorId: string, content: string) => {
  return await prisma.forumReply.create({
    data: { threadId, authorId, content },
    include: { author: { select: { username: true, avatarUrl: true } } }
  });
};