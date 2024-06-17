import { NextRequest, NextResponse } from "next/server";
import User from "@/model/User/User";
import { getToken } from "next-auth/jwt";

export const GET = async (req: NextRequest) => {
  try {
    const token: any = await getToken({ req });

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not logged in",
        },
        { status: 401 }
      );
    }

    const user = await User.findById(token.id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (user.brawlStars.id === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "No brawlStars found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        data: user.brawlStars,
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
