"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Game } from "./featuredGames";
import Link from "next/link";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

export function CarouselSize() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gray-900 z-0">
      {/* Carousel Container */}
      <Carousel
        plugins={[plugin.current]}
        opts={{ align: "center" }}
        className="w-full max-w-4xl bg-gray-800 rounded-lg z-10"
      >
        <CarouselContent className="text-white">
          {Game.map((game, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="bg-gray-700 h-64 rounded-lg">
                  <CardContent className="flex flex-col items-center justify-center h-full p-4">
                    <div className="text-center">
                      <span className="text-3xl font-semibold">
                        {game.game}
                      </span>
                      <div>
                        <Link
                          href={`/games/${game.link}`}
                          className="mt-4 text-lg font-medium text-blue-400 hover:text-blue-300"
                        >
                          Play
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-white" />
        <CarouselNext className="text-white" />
      </Carousel>
    </div>
  );
}
