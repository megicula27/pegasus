import dbconnection from "@/database/database";
import TournamentBrawl from "@/model/BrawlStars/TournamentBrawl";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await dbconnection();
    const token: any = await getToken({ req });
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "User not authenticated",
        },
        { status: 401 }
      );
    }

    const teamId = token.teams ? token?.teams[0]?.team : null; // this can be undefined
    const body = await req.json();
    const { sortBy, prize, joined, active } = {
      sortBy: body.sortBy || "prize",
      prize: body.prize || 0,
      joined: body.joined || null,
      active: body.active || true,
    };
    console.log(sortBy, prize, joined, active);

    // Update the status of tournaments whose endDate has passed
    await TournamentBrawl.updateMany(
      { endDate: { $lt: new Date() }, status: "scheduled", active: true },
      { $set: { status: "completed", active: false } }
    );

    const pipeline: any = [
      {
        $match: {
          active: active,
          status: { $ne: "completed" }, // Exclude completed tournaments
        },
      },
    ];

    if (prize) {
      pipeline.push({
        $match: {
          prize: { $gte: prize },
        },
      });
    }

    if (joined !== null && teamId !== null) {
      if (joined === "true") {
        pipeline.push({
          $match: {
            teams: teamId,
          },
        });
      } else {
        pipeline.push({
          $match: {
            teams: { $ne: teamId },
          },
        });
      }
    }

    pipeline.push({
      $sort: {
        [sortBy]: 1,
      },
    });

    pipeline.push({
      $project: {
        _id: 1,
        uid: 1,
        prize: 1,
        name: 1,
        description: 1,
        teams: 1,
        tournamentSize: 1,
        startDate: 1,
        endDate: 1,
      },
    });

    const tournaments = await TournamentBrawl.aggregate(pipeline);

    return NextResponse.json(
      {
        success: true,
        data: tournaments,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in processing request:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
};
