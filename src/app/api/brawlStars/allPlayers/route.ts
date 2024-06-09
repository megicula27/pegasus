import dbconnection from "@/database/database";
import User from "@/model/User/User";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");

  if (!search) {
    return NextResponse.json(
      {
        success: false,
        message: "Search parameter is required",
      },
      { status: 404 }
    );
  }

  try {
    await dbconnection();

    const user = await User.findOne({
      username: new RegExp(`^${search}$`, "i"), // Case-insensitive search
    }).select("username");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "No Player found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error,
      },
      { status: 500 }
    );
  }
};
