import dbconnection from "@/database/database";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import User from "@/model/User/User";

export const POST = async (req: NextRequest, res: NextResponse) => {
  await dbconnection();

  try {
    const body = await req.json(); // Parse the request body
    const { playerProfile, rank, playerTag } = body;

    if (!rank) {
      return NextResponse.json(
        { success: false, message: "Rank is required" },
        { status: 400 }
      );
    }

    const token: any = await getToken({ req });

    const { trophies, highestTrophies, name } = playerProfile;

    // Check if playerTag is already associated with any user
    const existingUser = await User.findOne({ "brawlStars.id": playerTag });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Player tag is already associated with another user",
        },
        { status: 400 }
      );
    }

    const user = await User.findById({ _id: token.id }).select(
      "username brawlStars"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "No user found" },
        { status: 404 }
      );
    }

    user.brawlStars = {
      id: playerTag,
      name: name,
      trophies: trophies,
      highestTrophies: highestTrophies,
      rank: rank,
    };

    await user.save();

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
