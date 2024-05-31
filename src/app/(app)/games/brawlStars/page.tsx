import React from "react";
import PlayerProfilePage from "@/components/games/BrawlStars/home/BrawlStarsProfile";
import CreateBrawlTeam from "@/components/games/BrawlStars/team/CreateBrawlTeam";

const BrawlStars = () => {
  return (
    <div>
      <PlayerProfilePage />
      {/* <SearchBrawlPlayer /> */}
      <CreateBrawlTeam />
    </div>
  );
};

export default BrawlStars;
