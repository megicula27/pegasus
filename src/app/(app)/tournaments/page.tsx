"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import TournamentCard from "@/components/games/BrawlStars/tournament/TournamentCard";
import TournamentFilterBrawl from "@/components/games/BrawlStars/tournament/TournamentFilterBrawl";

interface ITournament {
  id: string;
  name: string;
  description: string;
  prize: number;
  tournamentSize: number;
  teams: Array<mongoose.Schema.Types.ObjectId>;
  starDate: Date;
  endDate: Date;
}

const page = () => {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<ITournament[]>([]);
  const [selectedGame, setSelectedGame] = useState("Please select a game");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const game = params.get("game");

    if (game) {
      setSelectedGame(game);
    }
  }, []);

  const handleGameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGame(e.target.value);
    if (selectedGame === "empty") {
      router.push("/tournaments");
    } else {
      router.push(`/tournaments?game=${selectedGame}`);
    }
  };

  const renderFilterComponent = () => {
    switch (selectedGame) {
      case "Brawl Stars":
        return <TournamentFilterBrawl setTournaments={setTournaments} />;

      default:
        return (
          <div className="text-white">Select a game to see filter options</div>
        );
    }
    // other game tournament filters
  };

  return (
    <div className="bg-gray-800 min-h-screen">
      <div className="container mx-auto py-8">
        <div className="bg-gray-700 p-4 rounded-md mb-4">
          <h2 className="text-white font-bold mb-2">
            Search Active tournaments
          </h2>
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
              <option value="Brawl Stars">Brawl Stars</option>
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
        {tournaments.length > 0 ? (
          <div>
            {tournaments.map((tournament: any) => {
              if (!tournament.uid) {
                console.warn("Tournament is missing a uid:", tournament);
                return null;
              }
              return (
                <TournamentCard
                  key={tournament.uid}
                  uid={tournament.uid}
                  name={tournament.name}
                  description={tournament.description}
                  prize={tournament.prize}
                  teams={tournament.teams}
                  tournamentSize={tournament.tournamentSize}
                  startDate={tournament.startDate}
                  endDate={tournament.endDate}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default page;
