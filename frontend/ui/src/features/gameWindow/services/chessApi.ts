// src/features/gameWindow/services/chessApi.ts

export interface AnalysisResponse {
  fen: string;
  gameState: string;
  legalMoves: string[];
}

export const analyzePosition = async (fen: string, move?: string): Promise<AnalysisResponse> => {
  const response = await fetch('http://localhost:8080/api/analysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fen, move }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch analysis from engine');
  }

  return response.json();
};