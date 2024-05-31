import dbconnection from "@/database/database";
import Team from "@/model/TeamBrawl";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  await dbconnection();

  try {
    const { player, teamName } = await req.json();

    const team = await Team.findOne({ name: teamName });
    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    const user = await User.findOne({ username: player.username });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.teams.find((t) => t.game === "brawl stars")) {
      return NextResponse.json(
        { success: false, message: "User is already in a team" },
        { status: 400 }
      );
    }

    if (team.players.length >= team.teamSize) {
      return NextResponse.json(
        { success: false, message: "Team is already full" },
        { status: 400 }
      );
    }

    // Add the user to the team's players array
    team.players.push(user._id);
    await team.save();

    // Add the team to the user's teams array
    const userTeam = { game: "brawl stars", team: team._id };
    user.teams.push(userTeam);
    await user.save();

    return NextResponse.json(
      { success: true, message: "Player added to the team" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
};
