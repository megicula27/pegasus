"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PlayerAddComponent from "./PlayerAddComponent";
import axios from "axios";
import toast from "react-hot-toast";
import PlayerSearchBrawlStars from "../player/PlayerSearchBrawlStars";
import { useRouter } from "next/navigation";
const CreateBrawlTeam = () => {
  interface IPlayer {
    _id: string;
    username: string;
  }

  const { data: session }: any = useSession();
  const router = useRouter();
  const [brawlTeam, setBrawlTeam] = useState<IPlayer[]>([]);
  const [player, setPlayer] = useState("");
  const [foundPlayer, setFoundPlayer] = useState<IPlayer | null>(null);
  const [teamName, setTeamName] = useState("");
  const [validTeam, setValidTeam] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const teamResponse = await axios.get(`/api/brawlStars/team/getTeam`);
        const team = teamResponse.data;

        if (!team) {
          console.log("No team found");
          return;
        }

        const response = await axios.get(
          `/api/brawlStars/team/${team.team._id}`
        );

        if (response.data.success) {
          setTeamName(response.data.data.name);
          setBrawlTeam(response.data.data.players);
        } else {
          toast.error(response.data.message || "Failed to fetch team members");
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
        toast.error("Failed to fetch team members");
      }
    };

    if (session && session.user) {
      fetchTeamMembers();
    }
  }, [session]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `/api/brawlStars/allPlayers?search=${player}`
      );
      setFoundPlayer(response.data.data);
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // If the server responded with an error message
        toast.error(error.response.data.message);
      } else {
        console.error("Error:", error);
        toast.error("An error occurred while searching for the player");
      }
      setFoundPlayer(null);
    }
  };

  const handlePlayerAddition = async () => {
    if (foundPlayer) {
      try {
        const response = await axios.post(`/api/brawlStars/teamAddition`, {
          player: foundPlayer,
          teamName: teamName,
        });

        console.log("Response:", response.data);

        if (response.data.success) {
          toast.success("Player added to the team");
          setBrawlTeam([...brawlTeam, foundPlayer]);
          setFoundPlayer(null);
        } else {
          toast.error(response.data.message || "Player not added");
        }
      } catch (error: any) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          // If the server responded with an error message
          toast.error(error.response.data.message);
        } else {
          console.error("Error:", error);
          toast.error("An error occurred while adding the player to the team");
        }
      }
    }
  };
  const handlePlayerRemoval = async (playerId: string) => {
    const updatedTeam = brawlTeam.filter((player) => player._id !== playerId);

    // Check if the player being removed is the current user
    const isRemovingSelf = session?.user?.id === playerId;
    if (isRemovingSelf) {
      setBrawlTeam([]);
    } else {
      setBrawlTeam(updatedTeam);
    }

    try {
      const response = await axios.post(`/api/brawlStars/team/playerRemoval`, {
        teamName,
        updatedTeam,
        playerId,
      });

      if (response.data.success) {
        if (isRemovingSelf) {
          toast.success("You have left the team");
          router.push("/games/brawlStars");
        } else {
          toast.success("Player removed from the team");
        }
      } else {
        toast.error(response.data.message || "Player not removed");
      }
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // If the server responded with an error message
        toast.error(error.response.data.message);
      } else {
        console.error("Error:", error);
        toast.error(
          "An error occurred while removing the player from the team"
        );
      }
    }
  };
  const handleTeamName = async () => {
    try {
      const response = await axios.post("/api/brawlStars/team/create", {
        teamName,
      });

      if (response.data.success) {
        toast.success("Team created successfully");
        setBrawlTeam([...brawlTeam, response.data.data]);
        setValidTeam(true);
      } else {
        toast.error("Team name already taken");
        setTeamName("");
      }
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // If the server responded with an error message
        toast.error(error.response.data.message);
      } else {
        console.error("Error:", error);
        toast.error("An error occurred while creating the team");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <div className="w-1/2 p-8">
        <h1 className="text-2xl font-semibold mb-6">Search Component</h1>
        <PlayerSearchBrawlStars />
      </div>

      <div className="w-1/2 p-8 bg-gray-800 rounded-lg shadow-lg">
        {brawlTeam.length > 0 ? (
          <div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Team:</h2>
              {brawlTeam.map((player: any, index: number) => {
                // :TODO change any to player type
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-2"
                  >
                    <p>{player.username}</p>
                    <button
                      onClick={() => handlePlayerRemoval(player._id)}
                      className="px-2 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

            {brawlTeam.length < 3 && brawlTeam.length !== 0 ? (
              <div>
                <span className="block mb-2">Add Players</span>
                <PlayerAddComponent
                  player={player}
                  setPlayer={setPlayer}
                  handleSearch={handleSearch}
                  foundPlayer={foundPlayer}
                  handlePlayerAddition={handlePlayerAddition}
                />
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            <span className="block mb-2">Create your team</span>
            {validTeam && brawlTeam.length !== 0 ? (
              <PlayerAddComponent
                player={player}
                setPlayer={setPlayer}
                handleSearch={handleSearch}
                foundPlayer={foundPlayer}
                handlePlayerAddition={handlePlayerAddition}
              />
            ) : (
              <div>
                <label htmlFor="teamName" className="block mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-3 py-2 mb-4 text-gray-900 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleTeamName}
                  className="w-full px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Create
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBrawlTeam;
