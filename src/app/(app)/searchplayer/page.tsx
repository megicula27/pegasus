"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import BrawlStarsFilter from "@/components/games/BrawlStars/player/BrawlStarsFilter";

interface IFoundPlayers {
  tag: string;
  name: string;
  trophies: number;
  highestTrophies: number;
  rank: string;
}

const SearchPage = () => {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState("Please select a game");
  const [playersFound, setPlayersFound] = useState<IFoundPlayers[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const game = params.get("game");
    if (game) {
      setSelectedGame(game);
    }
  }, []);

  const handleGameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGame = e.target.value;
    setSelectedGame(selectedGame);
    if (selectedGame === "empty") {
      router.push("/searchplayer");
    } else {
      router.push(`/searchplayer?game=${selectedGame}`);
    }
  };

  const renderFilterComponent = () => {
    switch (selectedGame) {
      case "brawlstars":
        return <BrawlStarsFilter setPlayersFound={setPlayersFound} />;
      // Add cases for other games here
      //   case "valorant":
      //     return <ValorantFilter />;
      default:
        return (
          <div className="text-white">Select a game to see filter options</div>
        );
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen">
      <div className="container mx-auto py-8">
        <div className="bg-gray-700 p-4 rounded-md mb-4">
          <h2 className="text-white font-bold mb-2">Search Active Players</h2>
          <div className="flex items-center">
            <label htmlFor="game" className="text-white mr-2">
              Select Game
            </label>
            <select
              id="game"
              value={selectedGame ? selectedGame : "Select a game"}
              onChange={handleGameChange}
              className="px-3 py-2 bg-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="empty">Please select a game</option>
              <option value="brawlstars">Brawl Stars</option>
              <option value="valorant">Valorant</option>
              {/* Add options for other games here */}
            </select>
          </div>
        </div>
        <div className="bg-gray-900 p-4 rounded-md">
          <h2 className="text-white font-bold mb-2">
            Filters for {selectedGame}
          </h2>
          <Suspense fallback={<div>Loading filters...</div>}>
            {renderFilterComponent()}
          </Suspense>
        </div>
        {playersFound.length > 0 ? (
          <div>
            {playersFound.map((player: any) => {
              return (
                <div
                  className="bg-gray-800 p-4 rounded-md mb-4"
                  key={player.tag}
                >
                  <p className="mb-2">
                    <span className="font-bold text-white">Name:</span>{" "}
                    {player.brawlStars && (
                      <span className="text-white">
                        {player.brawlStars.name}
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    <span className="font-bold text-white">Tag:</span>{" "}
                    {player.brawlStars && (
                      <span className="text-white">{player.brawlStars.id}</span>
                    )}
                  </p>
                  <p className="mb-2">
                    <span className="font-bold text-white">Rank:</span>{" "}
                    {player.brawlStars && (
                      <span className="text-white">
                        {player.brawlStars.rank}
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    <span className="font-bold text-white">Trophies:</span>{" "}
                    {player.brawlStars && (
                      <span className="text-white">
                        {player.brawlStars.trophies}
                      </span>
                    )}
                  </p>
                  <p className="mb-2">
                    <span className="font-bold text-white">
                      Highest Trophies:
                    </span>{" "}
                    {player.brawlStars && (
                      <span className="text-white">
                        {player.brawlStars.highestTrophies}
                      </span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchPage;
