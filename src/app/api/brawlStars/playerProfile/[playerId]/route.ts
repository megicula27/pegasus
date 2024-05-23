import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://api.brawlstars.com/v1";
const API_KEY = process.env.BRAWL_STARS_API_KEY;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
});

interface PlayerProfile {
  name: string;
  tag: string;
  trophies: number;
  highestTrophies: number;
  // Add other fields as necessary
}

export const getPlayerProfile = async (
  playerId: string
): Promise<PlayerProfile> => {
  try {
    const encodedPlayerId = encodeURIComponent(playerId); // Encode the player ID
    const response = await axiosInstance.get(`/players/%23${encodedPlayerId}`); // Use encoded ID
    return response.data;
  } catch (error) {
    console.error("Error fetching player profile:", error);
    throw new Error("Technical error occurred while fetching player profile");
  }
};

export const GET = async (
  req: NextRequest,
  { params }: { params: { playerId: string } }
) => {
  const { playerId } = params;
  console.log("playerID: ", playerId, "params: ", params);

  if (!playerId || typeof playerId !== "string") {
    return NextResponse.json(
      { success: false, message: "Invalid playerId" },
      { status: 400 }
    );
  }

  try {
    const playerProfile = await getPlayerProfile(playerId);
    return NextResponse.json({ success: true, data: playerProfile });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};

export async function POST(req: NextRequest) {
  // Add your POST handler logic here
  return NextResponse.json(
    { success: false, message: "POST method not implemented" },
    { status: 501 }
  );
}
