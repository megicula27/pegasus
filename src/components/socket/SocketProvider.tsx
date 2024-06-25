"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

// Define types
interface WebSocketContextProps {
  socket: WebSocket | null;
  isConnected: boolean;
  sendInvitation: (to: string, playerName: string, playerRank: string) => void;
}

interface WebSocketProviderProps {
  children: ReactNode;
}

interface InvitationData {
  type: "invitation";
  from: string;
  to: string;
  name: string;
  rank: string;
}

interface ResponseData {
  type: "response";
  to: string;
  from: string;
  response: "accept" | "reject";
  playerName: string;
}

interface InvitationFailedData {
  type: "invitationFailed";
  message: string;
}

interface InvitationSentData {
  type: "sentInvitation";
  message: string;
}

interface OpponentDisconnectedData {
  type: "opponentDisconnected";
  message: string;
}

interface UserStateData {
  type: "userState";
  hasPendingInvitation: boolean;
  inActiveGame: boolean;
}

// Update the ServerMessage type to include the new message types
type ServerMessage =
  | InvitationSentData
  | InvitationData
  | ResponseData
  | InvitationFailedData
  | OpponentDisconnectedData
  | UserStateData;

const WebSocketContext = createContext<WebSocketContextProps | null>(null);

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const { data: session }: any = useSession();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (session) {
      const socketInstance = new WebSocket(
        "wss://pegasus-server.onrender.com/ws"
      );
      setSocket(socketInstance);

      socketInstance.onopen = () => {
        console.log("Connected to WebSocket server");
        setIsConnected(true);

        // Register the user ID with the WebSocket server
        socketInstance.send(
          JSON.stringify({ type: "register", userID: session.user.id })
        );
      };

      socketInstance.onmessage = (event) => {
        const data: ServerMessage = JSON.parse(event.data);

        switch (data.type) {
          case "invitation":
            toast(
              (t) => (
                <div>
                  Invite from {data.name} (Rank: {data.rank})
                  <button
                    onClick={() => handleInviteResponse(data, "accept", t)}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleInviteResponse(data, "reject", t)}
                  >
                    Reject
                  </button>
                </div>
              ),
              { duration: Infinity }
            );
            break;
          case "response":
            if (data.response === "accept") {
              toast.success(`${data.playerName} accepted your invite`);
            } else {
              toast.error(`${data.playerName} rejected your invite`);
            }
            break;
          case "sentInvitation":
            toast.success("Invitation Sent!");
            break;
          case "invitationFailed":
            toast.error(data.message);
            break;
          case "userState":
            if (data.hasPendingInvitation) {
              toast.error("You have a pending invitation.");
            }
            if (data.inActiveGame) {
              toast.success("You are currently in an active game.");
            }
            break;
          default:
            console.log("Unknown message from server:", data);
        }
      };

      socketInstance.onclose = () => {
        console.log("Disconnected from WebSocket server");
        setIsConnected(false);
      };

      socketInstance.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }
  }, [session]);

  const sendInvitation = (
    to: string,
    playerName: string,
    playerRank: string
  ) => {
    if (socket && isConnected && session) {
      const data: InvitationData = {
        type: "invitation",
        from: session.user.id,
        to,
        name: playerName,
        rank: playerRank,
      };
      socket.send(JSON.stringify(data));
    } else {
      toast.error("Not connected or not logged in");
    }
  };

  const handleInviteResponse = (
    data: InvitationData,
    response: "accept" | "reject",
    t: any
  ) => {
    if (socket && isConnected && session) {
      const responseData: ResponseData = {
        type: "response",
        to: data.from,
        from: session.user.id,
        response,
        playerName: session.user.name,
      };
      console.log("Sending response:", responseData);
      socket.send(JSON.stringify(responseData));
      toast.dismiss(t.id);
      toast.success(`You ${response}ed the invite`);
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, sendInvitation }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextProps => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
