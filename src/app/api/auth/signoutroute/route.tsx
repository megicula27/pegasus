import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import dbconnection from "@/database/database";
import User from "@/model/User";

export async function POST(req: NextApiRequest) {
  try {
    await dbconnection();
    const token = await getToken({ req });
    console.log(token);

    if (!token) {
      return Response.json({ success: false, message: "No token found" });
    }

    const user = await User.findById(token.id);

    if (!user) {
      return Response.json({ success: false, message: "No user found" });
    }

    user.isActive = false;
    await user.save();

    return Response.json({ success: true, message: "Successfully signed out" });
  } catch (error: any) {
    return Response.json({ success: false, message: error.message });
  }
}
