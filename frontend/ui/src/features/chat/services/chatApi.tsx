import { apiClient } from '../../shared/services/apiClient';

export interface ChatRoom {
  id: string;
  name: string | null;
  isGroup: boolean;
  avatarUrl: string | null;
  members: {
    userId: string;
    role: string;
    user: {
      id: string;
      username: string;
      avatarUrl: string | null;
    };
  }[];
}

export interface Message {
  _id: string;
  roomId: string;
  senderId: string;
  text?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface ChatInvite {
  id: string;
  roomId: string;
  room: { id: string; name: string; avatarUrl: string | null; };
  inviter: { username: string; avatarUrl: string | null; };
  status: string;
  createdAt: string;
}

export interface ChatMember {
  userId: string;
  role: string;
  user: { id: string; username: string; avatarUrl: string | null; };
}

export const chatApi = {
  getRooms: async (): Promise<ChatRoom[]> => {
    const response = await apiClient.get<ChatRoom[]>('/chat/rooms');
    return response.data;
  },
  createRoom: async (name: string, isGroup: boolean = true): Promise<ChatRoom> => {
    const response = await apiClient.post<ChatRoom>('/chat/rooms', { name, isGroup });
    return response.data;
  },
  getMessages: async (roomId: string): Promise<Message[]> => {
    const response = await apiClient.get<Message[]>(`/chat/rooms/${roomId}/messages`);
    return response.data;
  },

  sendInvite: async (roomId: string, username: string): Promise<void> => {
    await apiClient.post(`/chat/rooms/${roomId}/invites`, { username });
  },
  getMyInvites: async (): Promise<ChatInvite[]> => {
    const response = await apiClient.get<ChatInvite[]>('/chat/invites');
    return response.data;
  },
  respondToInvite: async (inviteId: string, accept: boolean): Promise<void> => {
    await apiClient.put(`/chat/invites/${inviteId}`, { accept });
  },
  getRoomMembers: async (roomId: string): Promise<ChatMember[]> => {
    const response = await apiClient.get<ChatMember[]>(`/chat/rooms/${roomId}/members`);
    return response.data;
  },
  kickMember: async (roomId: string, userId: string): Promise<void> => {
    await apiClient.delete(`/chat/rooms/${roomId}/members/${userId}`);
  },
  promoteMember: async (roomId: string, userId: string): Promise<void> => {
    await apiClient.put(`/chat/rooms/${roomId}/members/${userId}/role`);
  },
  leaveRoom: async (roomId: string): Promise<void> => {
    await apiClient.delete(`/chat/rooms/${roomId}/leave`);
  },
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiClient.post<{ imageUrl: string }>('/chat/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.imageUrl;
  },
};