import mongoose, { Schema, Model, Document } from "mongoose";
import Game from "./Game";

interface ITeam extends Document {
  name: string;
  players: Array<mongoose.Schema.Types.ObjectId>;
  game: mongoose.Schema.Types.ObjectId;
}

const teamSchema: Schema<ITeam> = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  players: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  game: {
    type: Schema.Types.ObjectId,
    ref: "Game",
    required: true,
  },
});

teamSchema.pre("save", async function (next) {
  const team = this as ITeam;

  const game = await Game.findById(team.game);

  if (!game) {
    return next(new Error("Game not found"));
  }

  if (team.players.length > game.teamSize) {
    return next(new Error(`Team size cannot exceed ${game.teamSize} players`));
  }
  next();
});

const Team: Model<ITeam> =
  (mongoose.models.Team as Model<ITeam>) ||
  mongoose.model<ITeam>("Team", teamSchema);

export default Team;
