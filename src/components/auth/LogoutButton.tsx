// components/LogoutButton.tsx
"use client";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";

const LogoutButton = () => {
  const handleLogout = async () => {
    await signOut();
    toast.success("Successfully logged out");
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
