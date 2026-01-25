'use client';
import React, { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import TimeControlCard from '../components/objects/TimeControlCard';
import ActionButtons from '../components/objects/ActionButtons';
import StatsDisplay from '../components/objects/StatsDisplay';
import { gameTypes, additionalGames } from '../data/playPageData';

const PlayPageLayout = () => {
  const [onlinePlayers] = useState("--");
  const [gamesInPlay] = useState("--");

  return (
    <PageWrapper>
      <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-12 animate-in fade-in slide-in-from-bottom duration-1000">
        Quick Play
      </h1>

      <div className="space-y-8 mb-16">
        {gameTypes.map((section, sectionIndex) => (
          <div key={sectionIndex} className="animate-in fade-in slide-in-from-bottom duration-1000" style={{ animationDelay: `${(sectionIndex + 1) * 200}ms` }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {section.games.map((game, gameIndex) => (
                <TimeControlCard key={gameIndex} game={game} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-16 animate-in fade-in slide-in-from-bottom duration-1000 delay-1000">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {additionalGames.map((game, gameIndex) => (
            <TimeControlCard key={gameIndex} game={game} />
          ))}
        </div>
      </div>
      
      <ActionButtons />
      
      <StatsDisplay onlinePlayers={onlinePlayers} gamesInPlay={gamesInPlay} />
    </PageWrapper>
  );
};

export default PlayPageLayout;