import dbconnection from "@/database/database";
import TeamBrawl from "@/model/BrawlStars/TeamBrawl";
import TournamentBrawl from "@/model/BrawlStars/TournamentBrawl";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await dbconnection();
    const body = await req.json();
    const { uid, teamId } = body;

    const tournament = await TournamentBrawl.findOne({ uid });

    if (!tournament) {
      return NextResponse.json(
        {
          success: false,
          message: "Tournament not found",
        },
        { status: 404 }
      );
    }

    tournament.teams.push(teamId);
    await tournament.save();

    const team = await TeamBrawl.findById(teamId);

    team?.tournaments.push(tournament._id);
    await team?.save();

    return NextResponse.json(
      {
        success: true,
        message: "Team added to tournament successfully",
        tournament,
      },
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
