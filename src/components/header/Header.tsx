"use client";
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoutButton from "../auth/LogoutButton";
const Header = () => {
  const { data: session } = useSession();

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href={"/"}>Pegasus</Link>
        <Link href={"/teams"}>Teams</Link>
        <Link href={"/searchplayer"}>Search Players</Link>
        <Link href={"/tournaments"}>Tournaments</Link>
        <Link href={"/games"}>Games</Link>
        {session ? (
          <>
            <span className="mr-4">Welcome</span>
            <LogoutButton />
          </>
        ) : (
          <Link href="/login">
            <button className="w-full md:w-auto bg-slate-100 text-black">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;
