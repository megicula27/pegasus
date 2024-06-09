"use client";
import React, { useEffect, useState } from "react";
import Countdown, { zeroPad } from "react-countdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export interface TournamentProps {
  uid: string;
  name: string;
  description: string;
  prize: number;
  teams: string[];
  tournamentSize: number;
  startDate: Date;
  endDate: Date;
}

const TournamentCard = ({
  uid,
  name,
  description,
  prize,
  teams: tournamentTeams,
  tournamentSize,
  startDate,
  endDate,
}: TournamentProps) => {
  const { data: session }: any = useSession();
  const router = useRouter();
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    const getTournamentDetails = async () => {
      try {
        const response = await axios.get(`/api/brawlStars/team/getTeam`);
        const team = response.data;

        console.log("team", team, "teams", tournamentTeams);

        if (team && tournamentTeams.includes(team.team._id)) {
          setHasJoined(true);
        }
      } catch (error: any) {
        console.error("Error fetching tournament details:", error);

        if (axios.isAxiosError(error)) {
          if (error.response) {
            // Server responded with a status other than 200 range
            const { status, data } = error.response;
            if (status === 400) {
              toast.error(data.message || "User doesn't have a team");
            } else {
              toast.error(data.message || "An error occurred");
            }
          } else if (error.request) {
            // Request was made but no response received
            toast.error("No response from the server. Please try again later.");
          } else {
            // Something happened in setting up the request
            toast.error(`Request error: ${error.message}`);
          }
        } else {
          // Non-Axios error
          toast.error(error.message);
        }
      }
    };

    if (session) {
      getTournamentDetails();
    }
  }, [session, tournamentTeams]);

  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed) {
      return <span>Tournament Live</span>;
    } else {
      return (
        <span>
          {zeroPad(days)}d {zeroPad(hours)}h {zeroPad(minutes)}m{" "}
          {zeroPad(seconds)}s
        </span>
      );
    }
  };

  const handleTournamentJoinLeave = async () => {
    if (!session) {
      toast.error("You must be logged in to join or leave a tournament");
      return;
    }

    const teamResponse = await axios.get(`/api/brawlStars/team/getTeam`);
    const team = teamResponse.data;
    if (!team) {
      toast.error(
        "Please create a Brawl Stars team before joining a tournament"
      );
      return;
    }
    console.log();

    if (team.team.players.length < 3) {
      toast.error("You must have 3 players to join a tournament");
      return;
    }

    const teamId = team.team._id;
    const url = hasJoined
      ? "/api/tournaments/brawlStars/leaveTournament"
      : "/api/tournaments/brawlStars/joinTournament";

    try {
      const response = await axios.post(url, {
        teamId,
        uid,
      });

      if (response.data.success) {
        toast.success(
          `You have successfully ${
            hasJoined ? "left" : "joined"
          } the tournament!`
        );
        setHasJoined(!hasJoined);
        router.push(`/tournaments/${uid}`);
      } else {
        throw new Error(
          response.data.message ||
            `Failed to ${hasJoined ? "leave" : "join"} the tournament`
        );
      }
    } catch (error: any) {
      console.error(
        `Error ${hasJoined ? "leaving" : "joining"} tournament:`,
        error
      );

      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(
            `Error: ${error.response.data.message || error.response.statusText}`
          );
        } else if (error.request) {
          toast.error("No response from the server. Please try again later.");
        } else {
          toast.error(`Request error: ${error.message}`);
        }
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Pool Prize: ₹{prize}</p>
        <p>
          Teams: {tournamentTeams.length}/{tournamentSize}
        </p>
        <p>
          Starts in:{" "}
          <Countdown date={new Date(startDate)} renderer={renderer} />
        </p>
        <p>Start Date: {new Date(startDate).toLocaleString()}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleTournamentJoinLeave}>
          <Countdown
            date={new Date(startDate)}
            renderer={({ completed }) =>
              completed ? "Watch" : hasJoined ? "Leave" : "Join with your team"
            }
          />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TournamentCard;
