"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { TournamentProps } from "@/components/games/BrawlStars/tournament/TournamentCard";
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
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

const TournamentDetails = () => {
  const params = useParams();
  const tournamentIdentifier = params ? params.tournamentIdentifier : undefined;

  const [tournament, setTournament] = useState<TournamentProps>();
  const [loading, setLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchTournament = async () => {
      if (!tournamentIdentifier) return;

      try {
        console.log(tournamentIdentifier);

        const response = await axios.get(
          `/api/tournaments/brawlStars/${tournamentIdentifier}`
        );

        if (response.data.success) {
          setTournament(response.data.tournament);

          // Check if the user's team has joined the tournament
          if (session) {
            const teamResponse = await axios.get(
              `/api/brawlStars/team/getTeam`
            );
            const team = teamResponse.data;

            if (
              team &&
              response.data.tournament.teams.includes(team.team._id)
            ) {
              setHasJoined(true);
            }
          }
        } else {
          toast.error("Failed to fetch tournament details");
        }
      } catch (error) {
        console.error("Error fetching tournament details:", error);
        toast.error(
          "Error fetching tournament details. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [tournamentIdentifier, session]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tournament) {
    return <div>Tournament not found.</div>;
  }

  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed) {
      // Render a completed state
      return <span>Tournament Live</span>;
    } else {
      // Render a countdown
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

    try {
      const teamResponse = await axios.get(`/api/brawlStars/team/getTeam`);
      const team = teamResponse.data;

      if (!team) {
        toast.error(
          "Please create a Brawl Stars team before joining a tournament"
        );
        return;
      }

      const teamId = team.team._id;
      const url = hasJoined
        ? "/api/tournaments/brawlStars/leaveTournament"
        : "/api/tournaments/brawlStars/joinTournament";

      const response = await axios.post(url, {
        teamId,
        uid: tournamentIdentifier,
      });

      if (response.data.success) {
        toast.success(
          `You have successfully ${
            hasJoined ? "left" : "joined"
          } the tournament!`
        );
        setHasJoined(!hasJoined);
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
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{tournament.name}</CardTitle>
          <CardDescription>{tournament.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Pool Prize: ₹{tournament.prize}</p>
          <p>
            Teams: {tournament.teams ? tournament.teams.length : 0}/
            {tournament.tournamentSize}
          </p>
          <p>
            Starts in:{" "}
            <Countdown
              date={new Date(tournament.startDate)}
              renderer={renderer}
            />
          </p>
          <p>Start Date: {new Date(tournament.startDate).toLocaleString()}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleTournamentJoinLeave}>
            <Countdown
              date={new Date(tournament.startDate)}
              renderer={({ completed }) =>
                completed
                  ? "Watch"
                  : hasJoined
                  ? "Leave"
                  : "Join with your team"
              }
            />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TournamentDetails;
