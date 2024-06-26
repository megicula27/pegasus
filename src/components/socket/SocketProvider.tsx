"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

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

  const socketRef = useRef<WebSocket | null>(null);
  const isConnectedRef = useRef(false);

  useEffect(() => {
    if (session) {
      connectSocket();
    }
  }, [session]);

  const connectSocket = () => {
    const socketInstance = new WebSocket(
      "wss://pegasus-server-production.up.railway.app/ws"
    );
    socketRef.current = socketInstance;
    setSocket(socketInstance);

    socketInstance.onopen = () => {
      console.log("Connected to WebSocket server");
      isConnectedRef.current = true;
      setIsConnected(true);

      if (session) {
        socketInstance.send(
          JSON.stringify({ type: "register", userID: session.user.id })
        );
      }
    };

    socketInstance.onmessage = (event) => {
      const data: ServerMessage = JSON.parse(event.data);

      switch (data.type) {
        case "invitation":
          toast(
            (t) => (
              <div
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  backgroundColor: "#fff",
                  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ marginBottom: "10px" }}>
                  Invite from <strong>{data.name}</strong> (Rank: {data.rank})
                </div>
                <button
                  onClick={() => handleInviteResponse(data, "accept", t)}
                  style={{
                    padding: "5px 10px",
                    marginRight: "10px",
                    borderRadius: "3px",
                    border: "none",
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleInviteResponse(data, "reject", t)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "3px",
                    border: "none",
                    backgroundColor: "#f44336",
                    color: "#fff",
                    cursor: "pointer",
                  }}
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

    socketInstance.onclose = (event) => {
      console.log("Disconnected from WebSocket server", event);
      isConnectedRef.current = false;
      setIsConnected(false);
    };

    socketInstance.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  const sendInvitation = (
    to: string,
    playerName: string,
    playerRank: string
  ) => {
    if (socketRef.current && isConnectedRef.current && session) {
      const data: InvitationData = {
        type: "invitation",
        from: session.user.id,
        to,
        name: playerName,
        rank: playerRank,
      };
      socketRef.current.send(JSON.stringify(data));
    } else {
      toast.error("Not connected or not logged in");
    }
  };

  const handleInviteResponse = (
    data: InvitationData,
    response: "accept" | "reject",
    t: any
  ) => {
    if (socketRef.current && isConnectedRef.current && session) {
      const responseData: ResponseData = {
        type: "response",
        to: data.from,
        from: session.user.id,
        response,
        playerName: session.user.brawlStars.name,
      };
      socketRef.current.send(JSON.stringify(responseData));
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
