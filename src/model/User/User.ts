import { teamSchema } from "@/lib/validation/teamSchema";
import mongoose, { Schema, Document, Model } from "mongoose";

// Define the IUser interface
interface IUser extends Document {
  uid: string;
  username: string;
  password: string;
  email: string;
  teams: Array<{
    game: string;
    team: mongoose.Schema.Types.ObjectId;
  }>;
  brawlStars: Array<{
    id: string;
    name: string;
    trophies: number;
    highestTrophies: number;
    rank: string;
  }>;
  isActive: Boolean;
}

// Define the user schema
const userSchema: Schema<IUser> = new Schema({
  uid: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  teams: [
    {
      game: {
        type: String,
      },
      team: {
        type: Schema.Types.ObjectId,
        refPath: "teams.game",
      },
    },
  ],
  brawlStars: [
    {
      id: String,
      name: String,
      trophies: Number,
      highestTrophies: Number,
      rank: String,
    },
  ],
  isActive: {
    type: Boolean,
    default: false,
  },
});

// Create the User model
const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", userSchema);

export default User;
