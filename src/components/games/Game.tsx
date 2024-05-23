"use client";
import React from "react";
import Link from "next/link";

const Game = () => {
  return (
    <div>
      <Link href={"/games/brawlStars"}>Brawl Stars</Link>
      <Link href={"/games/valorant"}>Valorant</Link>
    </div>
  );
};

export default Game;
