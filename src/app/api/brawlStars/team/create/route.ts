import dbconnection from "@/database/database";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import Team from "@/model/TeamBrawl";
import User from "@/model/User";
import { getToken } from "next-auth/jwt";
import { ITeam } from "@/model/TeamBrawl";
import mongoose from "mongoose";

// Define the user team interface
interface IUserteam {
  game: string;
  team: mongoose.Schema.Types.ObjectId;
}

// Define the POST handler
export const POST = async (req: NextRequest, res: NextApiResponse) => {
  await dbconnection();

  try {
    const token = await getToken({ req });

    // Use .json() to parse the request body
    const { teamName } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if the team name already exists

    const team = await Team.findOne({ name: teamName });
    if (team) {
      return NextResponse.json(
        {
          success: false,
          message: "Team Name already exists",
        },
        { status: 400 }
      );
    }
    console.log("line 45", teamName);
    // Find the user
    const user = await User.findOne({ username: token.name }).select(
      "username teams"
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found for team creation",
        },
        { status: 404 }
      );
    }

    // Create the new team
    const players = [user._id];

    const newTeam = new Team({
      name: teamName,
      players,
    });

    await newTeam.save();

    const userTeam: IUserteam = {
      game: "brawl stars",
      team: newTeam._id,
    };
    console.log("line 75", teamName);
    // Add the new team to the user's teams
    user.teams.push(userTeam);
    console.log("line 78", teamName);
    await user.save();
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while checking Team Name",
      },
      { status: 500 }
    );
  }
};
