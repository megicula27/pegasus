"use client";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const BrawlStarsFilter = ({ setPlayersFound }: any) => {
  const [sortBy, setSortBy] = useState("");
  const [trophies, setTrophies] = useState("");
  const [rank, setRank] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the form submission logic

    try {
      const numberTrophy = Number(trophies);
      const response = await axios.post("/api/brawlStars/searchPlayer", {
        sortBy,
        trophies: numberTrophy,
        rank,
      });
      if (response.data.success) {
        if (response.data.data.length > 0) {
          toast.success("Players found");
          setPlayersFound(response.data.data); // response dekhna padega ek baar
        } else {
          toast.error("No players found");
          setPlayersFound([]);
        }
        console.log("response: ", response.data.data);
      } else {
        toast.error(response.data.message || "Failed to find players");
        setPlayersFound([]);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || "Invalid Filters"
      );
      setPlayersFound([]);
    }

    console.log({ sortBy, trophies, rank });
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
            <option value="username">Name</option>
            <option value="rank">Rank</option>
            <option value="trophies">Trophies</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="trophies" className="mb-1 text-white">
            Minimum Trophies
          </label>
          <input
            id="trophies"
            type="number"
            value={trophies}
            onChange={(e) => setTrophies(e.target.value)}
            className="px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="rank" className="mb-1 text-white">
            Rank
          </label>
          <select
            id="rank"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            className="px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-3 mb-3"
          >
            <option value="">Select a rank</option>{" "}
            <option value="bronze">Bronze</option>{" "}
            <option value="silver">Silver</option>{" "}
            <option value="gold">Gold</option>{" "}
            <option value="diamond">Diamond</option>{" "}
            <option value="mythic">Mythic</option>{" "}
            <option value="legendary">Legendary</option>{" "}
            <option value="masters">Masters</option>{" "}
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

export default BrawlStarsFilter;
