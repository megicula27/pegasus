// components/LogoutButton.tsx
"use client";
import axios from "axios";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";

const LogoutButton = () => {
  const handleLogout = async () => {
    const response = await axios.post("/api/auth/signoutroute");
    console.log(response);

    await signOut({ callbackUrl: "/login" });
    toast.success("Successfully logged out");
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
