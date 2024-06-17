"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

const CheckSessionOnLoad = () => {
  const { data: session } = useSession();

  useEffect(() => {
    const updateUserActiveStatus = async () => {
      if (session) {
        // Update user's active status to true when the app loads and session is active
        await axios.post("/api/auth/updateUserActiveStatus", {
          isActive: true,
        });
      }
    };

    updateUserActiveStatus();
  }, [session]);

  return null;
};

export default CheckSessionOnLoad;
