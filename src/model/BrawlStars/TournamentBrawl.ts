import mongoose, { Schema, Document, Model } from "mongoose";

interface ITournament extends Document {
  uid: string;
  name: string;
  description: string;
  prize: number;
  tournamentSize: number;
  teams: Array<mongoose.Schema.Types.ObjectId>;
  startDate: Date;
  endDate: Date;
  active: boolean;
  status: "scheduled" | "completed";
}

const tournamentSchema: Schema<ITournament> = new Schema({
  uid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  prize: {
    type: Number,
    required: true,
  },
  tournamentSize: {
    type: Number,
    required: true,
  },
  teams: [{ type: Schema.Types.ObjectId, ref: "TeamBrawl" }],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ["scheduled", "completed"],
    required: true,
    default: "scheduled",
  },
});

const TournamentBrawl: Model<ITournament> =
  (mongoose.models.TournamentBrawl as Model<ITournament>) ||
  mongoose.model<ITournament>("TournamentBrawl", tournamentSchema);

export default TournamentBrawl;
