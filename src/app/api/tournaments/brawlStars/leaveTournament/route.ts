import dbconnection from "@/database/database";
import TeamBrawl from "@/model/BrawlStars/TeamBrawl";
import TournamentBrawl from "@/model/BrawlStars/TournamentBrawl";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
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

    // Check if the team is part of the tournament
    const team_main = await TeamBrawl.findById(teamId);

    if (!team_main) {
      return NextResponse.json(
        {
          success: false,
          message: "Team not found",
        },
        { status: 404 }
      );
    }

    const teamObjectId = new ObjectId(teamId);

    // Check if the team is part of the tournament
    const teamIndex = tournament.teams.findIndex((team: any) =>
      team.equals(teamObjectId)
    );

    if (teamIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Team is not part of this tournament",
        },
        { status: 400 }
      );
    }

    // Remove the team from the tournament
    const updatedTeams = tournament.teams.filter(
      (team: any) => !team.equals(teamObjectId)
    );

    await TournamentBrawl.updateOne(
      {
        uid,
      },
      {
        $set: { teams: updatedTeams },
      }
    );

    // Remove the tournament ID from the team's tournaments array
    await TeamBrawl.updateOne(
      {
        _id: teamId,
      },
      {
        $pull: { tournaments: tournament._id },
      }
    );
    return NextResponse.json({
      success: true,
      message: "Team has successfully left the tournament",
    });
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
