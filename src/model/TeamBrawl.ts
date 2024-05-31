import mongoose, { Schema, Model, Document } from "mongoose";

export interface ITeam extends Document {
  name: string;
  players: Array<mongoose.Schema.Types.ObjectId>;
  teamSize: number;
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
  teamSize: {
    type: Number,
    default: 3,
  },
});

const TeamBrawl: Model<ITeam> =
  (mongoose.models.TeamBrawl as Model<ITeam>) ||
  mongoose.model<ITeam>("TeamBrawl", teamSchema);

export default TeamBrawl;
