import dbconnection from "@/database/database";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import User from "@/model/User";

export const POST = async (req: NextRequest, res: NextResponse) => {
  await dbconnection();

  try {
    const body = await req.json(); // Parse the request body
    const { playerProfile, rank, playerTag } = body;
    const token: any = await getToken({ req });

    const { trophies, highestTrophies, name } = playerProfile;

    const user = await User.findById({ _id: token.id }).select(
      "username brawlStars"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "No user found" },
        { status: 404 }
      );
    }

    user.brawlStars = [
      {
        id: playerTag,
        name: name,
        trophies: trophies,
        highestTrophies: highestTrophies,
        rank: rank,
      },
    ];

    await user.save();

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
};
