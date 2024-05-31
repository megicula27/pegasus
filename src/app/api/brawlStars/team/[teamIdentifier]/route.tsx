import dbconnection from "@/database/database";
import Team from "@/model/TeamBrawl";
import { NextResponse, NextRequest } from "next/server";
import { getSession } from "next-auth/react"; // Import getSession to get the session user
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";

export const GET = async (req: NextRequest) => {
  const { pathname } = new URL(req.url);
  const teamId = pathname.split("/").pop();

  if (!teamId) {
    return NextResponse.json({
      success: false,
      message: "Team ID is required",
    });
  }

  try {
    await dbconnection();

    const session: any = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated",
      });
    }

    const userId = session.user.id;

    const team = await Team.findById(teamId).populate("players", "username");

    if (!team) {
      return NextResponse.json({
        success: false,
        message: "Team not found",
      });
    }

    // Check if the user ID is in the team's player list
    const isUserInTeam = team.players.some(
      (player: any) => player._id.toString() === userId
    );

    if (!isUserInTeam) {
      return NextResponse.json({
        success: true,
        data: {
          ...team.toObject(), // Convert the Mongoose document to a plain JavaScript object
          players: [],
          name: "", // Return an empty players array if the user is not in the team
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: team,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
};
