import React from "react";
import CreateTournamentForm from "@/components/games/BrawlStars/tournament/TournamentCreate";

const CreateTournamentPage = () => {
  return (
    <div>
      <h1 className="text-2xl text-center my-4">Create a New Tournament</h1>
      <CreateTournamentForm />
    </div>
  );
};

export default CreateTournamentPage;
