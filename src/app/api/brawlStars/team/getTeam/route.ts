import dbconnection from "@/database/database";
import TeamBrawl from "@/model/BrawlStars/TeamBrawl";
import User from "@/model/User/User";
import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await dbconnection();

    const token: any = await getToken({ req }); // Await the promise here

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Token not found, kindly login first",
        },
        { status: 401 }
      );
    }

    const userId = token.id;

    const user = await User.findById(userId).select("teams");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const hasTeam = user.teams.find((team: any) => team.game === "brawl stars");

    if (!hasTeam) {
      return NextResponse.json(
        {
          success: false,
          message: "User does not have a brawl team",
        },
        { status: 400 }
      );
    }

    const teamOriginal = await TeamBrawl.findById(hasTeam.team);

    if (!teamOriginal) {
      return NextResponse.json(
        {
          success: false,
          message: "Team not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User has a brawl team",
        team: teamOriginal,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error:", error); // Log the error for debugging
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
};
