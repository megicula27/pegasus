import dbconnection from "@/database/database";
import User from "@/model/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  await dbconnection();
  try {
    const { email, username, password } = await req.json();

    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (user) {
      return NextResponse.json({
        success: false,
        message: "User already exists, kindly login...",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    // Fetch the newly created user excluding the password field
    const userWithoutPassword = await User.findById(newUser._id).select(
      "-password"
    );

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
};
