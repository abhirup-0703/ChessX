'use client';
import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Chessboard from "../components/objects/ChessBoard";
import GameControlPanel from "../components/objects/GameControlPanel";
import GameInfo from "../components/objects/GameInfo";
import ChatBox from "../components/objects/ChatBox";
import { initialBoard } from "../data/gameData";


const GameWindowLayout = () => {
  return (
    <PageWrapper>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-start h-full">
        
        {/* Left Column */}
        <div className="flex flex-col h-[80vh]">
          <GameInfo />
          <ChatBox />
        </div>

        {/* Center Column (Chessboard) */}
        <div className="flex justify-center">
          <Chessboard boardState={initialBoard} />
        </div>

        {/* Right Column */}
        <div className="h-[80vh]">
          <GameControlPanel />
        </div>

      </div>
    </PageWrapper>
  );
};

export default GameWindowLayout;


