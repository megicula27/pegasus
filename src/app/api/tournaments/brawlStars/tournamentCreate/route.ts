import dbconnection from "@/database/database";
import TournamentBrawl from "@/model/BrawlStars/TournamentBrawl";
import { generateTournamentId } from "@/utils/generateId";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await dbconnection();
    const body = await req.json();
    const { name, description, tournamentSize, startDate, endDate, poolPrize } =
      body;
    const uid = generateTournamentId();
    const tournament = new TournamentBrawl({
      name,
      uid,
      description,
      tournamentSize,
      startDate,
      endDate,
      prize: poolPrize, // Ensure you are storing poolPrize correctly
    });
    console.log(
      name,
      description,
      tournamentSize,
      startDate,
      endDate,
      poolPrize,
      uid
    );

    await tournament.save();

    return NextResponse.json(
      {
        success: true,
        message: "Tournament created successfully",
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
