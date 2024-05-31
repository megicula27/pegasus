"use client";
import { useRouter } from "next/navigation";

const PlayerSearchBrawlStars = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/searchplayer?game=brawlstars`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-4"
      >
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Search Active Players in Brawl Stars
        </button>
      </form>
    </div>
  );
};

export default PlayerSearchBrawlStars;
