"use client";
import { useState } from "react";
import axios from "axios";

interface PlayerProfile {
  name: string;
  tag: string;
  trophies: number;
  highestTrophies: number;
  // Add other fields as necessary
}

type Idata = {
  success: boolean;
  data: PlayerProfile;
  message?: string;
};

export default function PlayerProfilePage() {
  const [playerTag, setPlayerTag] = useState("");
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayerProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<Idata>(
        `/api/brawlStars/playerProfile/${encodeURIComponent(playerTag)}`
      );
      console.log(response);

      const data = response.data;

      if (data.success) {
        setPlayerProfile(data.data);
      } else {
        setError(data.message || "Player profile not found");
      }
    } catch (err) {
      setError("An error occurred while fetching player profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="mb-6 text-2xl font-semibold text-center text-white">
          Player Profile
        </h1>
        <input
          type="text"
          value={playerTag}
          onChange={(e) => setPlayerTag(e.target.value.replace("#", ""))}
          placeholder="Enter Player Tag"
          className="w-full px-3 py-2 mb-4 text-gray-900 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={fetchPlayerProfile}
          disabled={loading}
          className="w-full px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {loading ? "Loading..." : "Get Profile"}
        </button>
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        {playerProfile && (
          <div className="mt-6 text-white">
            <h2 className="text-xl font-semibold">{playerProfile.name}</h2>
            <p>Tag: {playerProfile.tag}</p>
            <p>Trophies: {playerProfile.trophies}</p>
            <p>Highest Trophies: {playerProfile.highestTrophies}</p>
            {/* Display more profile details as needed */}
          </div>
        )}
      </div>
    </div>
  );
}
