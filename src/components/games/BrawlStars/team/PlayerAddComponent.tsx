import React from "react";

interface PlayerAddComponentProps {
  player: string;
  setPlayer: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
  foundPlayer: any; // Adjust type as necessary
  handlePlayerAddition: () => void;
}

const PlayerAddComponent: React.FC<PlayerAddComponentProps> = ({
  player,
  setPlayer,
  handleSearch,
  foundPlayer,
  handlePlayerAddition,
}) => {
  return (
    <div className="mt-4">
      <label htmlFor="playerSearch" className="block mb-2 text-white">
        Search for player using player ID or Username
      </label>
      <div className="flex">
        <input
          type="text"
          id="playerSearch"
          placeholder="Enter player ID or Username"
          value={player}
          onChange={(e) => setPlayer(e.target.value)}
          className="w-full px-3 py-2 mr-2 text-gray-900 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Search
        </button>
      </div>
      {foundPlayer ? (
        <div className="mt-2">
          <p className="text-white">{foundPlayer.username}</p>
          <button
            onClick={handlePlayerAddition}
            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add
          </button>
        </div>
      ) : (
        <div className="mt-2 text-white">No player found...</div>
      )}
    </div>
  );
};

export default PlayerAddComponent;
