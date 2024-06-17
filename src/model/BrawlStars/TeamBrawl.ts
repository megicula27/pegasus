import mongoose, { Schema, Model, Document } from "mongoose";

export interface ITeam extends Document {
  uid: string;
  name: string;
  players: Array<mongoose.Schema.Types.ObjectId>;
  teamSize: number;
  tournaments: Array<mongoose.Schema.Types.ObjectId>;
}

const teamSchema: Schema<ITeam> = new Schema({
  uid: {
    type: String,
    required: true,
  },
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
  teamSize: {
    type: Number,
    default: 3,
  },
  tournaments: [
    {
      type: Schema.Types.ObjectId,
      ref: "TournamentBrawl",
    },
  ],
});

const TeamBrawl: Model<ITeam> =
  (mongoose.models.TeamBrawl as Model<ITeam>) ||
  mongoose.model<ITeam>("TeamBrawl", teamSchema);

export default TeamBrawl;
