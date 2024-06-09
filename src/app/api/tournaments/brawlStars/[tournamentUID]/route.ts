import dbconnection from "@/database/database";
import TournamentBrawl from "@/model/BrawlStars/TournamentBrawl";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { tournamentUID: string } }
) {
  try {
    await dbconnection();

    const { tournamentUID } = params;

    if (!tournamentUID) {
      return NextResponse.json(
        {
          success: false,
          message: "Tournament UID not provided",
        },
        { status: 400 }
      );
    }

    const tournament = await TournamentBrawl.findOne({
      uid: tournamentUID,
    });

    if (!tournament) {
      return NextResponse.json(
        {
          success: false,
          message: "Tournament not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Tournament details fetched successfully",
        tournament: tournament,
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
}
