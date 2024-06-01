import { z } from "zod";

export const teamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  players: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid player ID")),
  game: z.string(),
});
