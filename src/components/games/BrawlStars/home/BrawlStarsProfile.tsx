"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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
  const router = useRouter();

  const [playerTag, setPlayerTag] = useState("");
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rank, setRank] = useState("");
  const [brawlStats, setBrawlStats] = useState([
    {
      rank: null,
      trophies: null,
      highestTrophies: null,
      name: null,
      id: null,
    },
  ]);
  const { data: session }: any = useSession();

  useEffect(() => {
    if (session) {
      if (session?.user?.brawlStars.length > 0) {
        setBrawlStats(session.user.brawlStars);
      }
    }
  });
  const fetchPlayerProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<Idata>(
        `/api/brawlStars/playerProfile/${encodeURIComponent(playerTag)}`
      );

      const data = response.data;

      if (data.success) {
        setPlayerProfile(data.data);
        toast.success("Player profile fetched successfully");
      } else {
        setError(data.message || "Player profile not found");
        toast.error(data.message || "Player profile not found");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "An error occurred while fetching player profile.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/brawlStars/playerProfile", {
        playerProfile,
        rank,
        playerTag,
      });
      const data = response.data;
      console.log("brawl stats", response.data);

      if (data.success) {
        toast.success("Player profile saved successfully");
      } else {
        const errorMessage = data.message || "Player profile not saved";
        setError(errorMessage);
        toast.error(errorMessage);
        router.push("/api/brawlStars/playerProfile");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "An error occurred while saving player profile.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {brawlStats[0].name !== null ? (
        <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Your Brawl Profile</h2>
          <p className="mb-2">
            <span className="font-bold">Name:</span> {brawlStats[0].name}
          </p>
          <p className="mb-2">
            <span className="font-bold">Tag:</span> {brawlStats[0].id}
          </p>
          <p className="mb-2">
            <span className="font-bold">Rank:</span> {brawlStats[0].rank}
          </p>
          <p className="mb-2">
            <span className="font-bold">Trophies:</span>{" "}
            {brawlStats[0].trophies}
          </p>
          <p>
            <span className="font-bold">Highest Trophies:</span>{" "}
            {brawlStats[0].highestTrophies}
          </p>
        </div>
      ) : (
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
                <label htmlFor="rank" className="text-white mr-2">
                  Rank:
                </label>
                <input
                  type="text"
                  id="rank"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  className="px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-3 mb-3"
                />

                {/* Display more profile details as needed */}
                <button
                  onClick={handleProfileSave}
                  disabled={loading}
                  className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
