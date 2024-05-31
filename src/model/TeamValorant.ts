import mongoose, { Schema, Model, Document } from "mongoose";

interface ITeam extends Document {
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
    default: 5,
  },
});

const TeamValorant: Model<ITeam> =
  (mongoose.models.TeamValorant as Model<ITeam>) ||
  mongoose.model<ITeam>("TeamValorant", teamSchema);

export default TeamValorant;
