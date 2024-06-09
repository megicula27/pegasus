import dbconnection from "@/database/database";
import TeamBrawl from "@/model/BrawlStars/TeamBrawl";
import User from "@/model/User/User";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  await dbconnection();

  try {
    const body = await req.json(); // Parse the request body
    const { teamName, updatedTeam, playerId } = body;

    const team = await TeamBrawl.findOne({ name: teamName });
    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    // If the updated team is empty, delete the team
    if (updatedTeam.length === 0) {
      await TeamBrawl.deleteOne({ name: teamName });
      return NextResponse.json(
        { success: true, message: "Team deleted successfully" },
        { status: 200 }
      );
    }

    // Update the team's players array
    team.players = updatedTeam.map((player: any) => player._id);
    await team.save();

    // Remove the team reference from the user's teams array if the user is being removed from the team
    const user = await User.findById(playerId);
    if (user) {
      user.teams = user.teams.filter((team) => team.game !== "brawl stars");
      await user.save();
    }

    return NextResponse.json(
      { success: true, message: "Player removed from the team" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
};
