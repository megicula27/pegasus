"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const CreateTournamentForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tournamentSize, settournamentSize] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [poolPrize, setPoolPrize] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/api/tournaments/brawlStars/tournamentCreate",
        {
          name,
          description,
          tournamentSize,
          startDate,
          endDate,
          poolPrize,
        }
      );

      if (response.data.success) {
        toast.success("Tournament created successfully!");
        // Optionally, reset the form
        setName("");
        setDescription("");
        settournamentSize("");
        setStartDate("");
        setEndDate("");
        setPoolPrize("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while creating the tournament.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-4 rounded-lg shadow-lg w-full"
      >
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="name">
            Tournament Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="tournamentSize">
            Tournament Size
          </label>
          <input
            id="tournamentSize"
            type="number"
            value={tournamentSize}
            onChange={(e) => settournamentSize(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="startDate">
            Start Date
          </label>
          <input
            id="startDate"
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="endDate">
            End Date
          </label>
          <input
            id="endDate"
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="poolPrize">
            Pool Prize
          </label>
          <input
            id="poolPrize"
            type="number"
            value={poolPrize}
            onChange={(e) => setPoolPrize(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Create Tournament
        </button>
      </form>
    </div>
  );
};

export default CreateTournamentForm;
