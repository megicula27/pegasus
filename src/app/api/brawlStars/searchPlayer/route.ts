import dbconnection from "@/database/database";
import User from "@/model/User/User";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await dbconnection();

    const body = await req.json();

    // Ensure default values are assigned properly
    const { sortBy, trophies, rank } = {
      sortBy: body.sortBy || "username",
      trophies: body.trophies || 0,
      rank: body.rank !== undefined ? body.rank : "", // Check for undefined to allow empty string as a valid value
    };

    // console.log("Received body:", body);
    // console.log("Pipeline parameters:", { sortBy, trophies, rank });

    const pipeline: any = [
      {
        $match: {
          isActive: true,
          "brawlStars.trophies": { $exists: true }, // Match documents where the trophies field exists inside brawlStars
        },
      },
    ];

    if (trophies) {
      pipeline.push({
        $match: {
          "brawlStars.trophies": { $gte: trophies },
        },
      });
    }

    if (rank !== "") {
      pipeline.push({
        $match: {
          "brawlStars.rank": rank,
        },
      });
    }

    pipeline.push({
      $sort: {
        [sortBy]: 1,
      },
    });

    pipeline.push({
      $project: {
        _id: 1,
        brawlStars: 1,
      },
    });

    // console.log("Constructed pipeline:", JSON.stringify(pipeline, null, 2));

    const users = await User.aggregate(pipeline).exec();
    // console.log("Query result:", users);

    return NextResponse.json(
      {
        success: true,
        data: users,
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
