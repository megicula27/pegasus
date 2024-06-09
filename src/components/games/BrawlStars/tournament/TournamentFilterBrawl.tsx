import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const TournamentFilterBrawl = ({ setTournaments }: any) => {
  const [sortBy, setSortBy] = useState("");
  const [poolPrize, setPoolPrize] = useState("");
  const [joined, setJoined] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    try {
      const numberPoolPrize = Number(poolPrize);
      console.log(numberPoolPrize);

      const response = await axios.post("/api/tournaments/brawlStars", {
        sortBy,
        prize: numberPoolPrize,
        joined,
      });
      console.log(response.data.data);

      setTournaments(response.data.data);
      toast.success("Filters applied successfully!");
    } catch (error) {
      toast.error("Failed to apply filters. Please try again.");
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-full">
      <form onSubmit={handleSubmit} className="flex space-x-4 items-center">
        <div className="flex flex-col">
          <label htmlFor="sortBy" className="mb-1 text-white">
            Sort By
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select an option</option>
            <option value="prize">Pool Prize</option>
            <option value="teamSize">Joined Teams</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="prize" className="mb-1 text-white">
            Minimum Pool Prize
          </label>
          <input
            id="prize"
            type="number"
            value={poolPrize}
            onChange={(e) => setPoolPrize(e.target.value)}
            className="px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="participation" className="mb-1 text-white">
            Joined
          </label>
          <select
            id="participation"
            value={joined}
            onChange={(e) => setJoined(e.target.value)}
            className="px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select an option</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Apply Filters
        </button>
      </form>
    </div>
  );
};

export default TournamentFilterBrawl;
