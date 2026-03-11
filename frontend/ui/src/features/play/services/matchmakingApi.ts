// src/features/play/services/matchmakingApi.ts

const JAVA_BACKEND_URL = process.env.NEXT_PUBLIC_JAVA_URL || 'http://localhost:8080/api/challenges';

export interface CreateChallengeRequest {
  receiverUsername: string;
  timeControl: string;
  colorPreference: 'WHITE' | 'BLACK' | 'RANDOM';
  isRated: boolean;
}

export interface GameChallenge {
  id: string;
  sender: { id: string; username: string };
  receiver: { id: string; username: string };
  timeControl: string;
  colorPreference: string;
  rated: boolean;
  status: string;
  createdAt: string;
}

// Helper to get token
const getToken = () => localStorage.getItem('token');

export const createChallenge = async (data: CreateChallengeRequest) => {
  const response = await fetch(JAVA_BACKEND_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create challenge');
  }
  return response.json();
};

export const getIncomingChallenges = async (): Promise<GameChallenge[]> => {
  const token = getToken();
  
  // Debugging: Check if the token actually exists
  console.log("Token being sent to Java backend:", token ? "Token exists" : "TOKEN IS NULL!");

  const response = await fetch(`${JAVA_BACKEND_URL}/incoming`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    // Read the exact error message from the Java backend
    const errorText = await response.text();
    console.error(`Backend rejected fetch challenges. Status: ${response.status}. Message:`, errorText);
    throw new Error(`Failed to fetch challenges: ${response.status} ${errorText}`);
  }
  
  return response.json();
};

export const acceptChallenge = async (challengeId: string): Promise<{ message: string; matchId: string }> => {
  const response = await fetch(`${JAVA_BACKEND_URL}/${challengeId}/accept`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) throw new Error('Failed to accept challenge');
  return response.json();
};

export const declineChallenge = async (challengeId: string) => {
  const response = await fetch(`${JAVA_BACKEND_URL}/${challengeId}/decline`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) throw new Error('Failed to decline challenge');
  return response.json();
};