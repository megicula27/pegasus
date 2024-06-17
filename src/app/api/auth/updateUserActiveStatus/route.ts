import dbconnection from "@/database/database";
import User from "@/model/User/User";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const POST = async (req: NextRequest) => {
  await dbconnection();

  try {
    // Parse request body
    const body = await req.json();
    const { isActive } = body;

    // Ensure isActive is provided
    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { message: "Invalid isActive value" },
        { status: 400 }
      );
    }

    // Get token
    const token = await getToken({ req });

    // Check if token is valid
    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Update user's active status
    const user = await User.findByIdAndUpdate(
      token.id,
      { isActive: isActive },
      { new: true }
    );

    // Check if user is found and updated
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Respond with success message
    return NextResponse.json(
      { message: "User active status updated" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user active status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
