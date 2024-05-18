import mongoose, { Schema, Document, Model } from "mongoose";

// Define the IUser interface
interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  teams: Array<{
    team: mongoose.Schema.Types.ObjectId;
    game: mongoose.Schema.Types.ObjectId;
  }>;
}

// Define the user schema
const userSchema: Schema<IUser> = new Schema({
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
      team: {
        type: Schema.Types.ObjectId,
        ref: "Team",
      },
      game: {
        type: Schema.Types.ObjectId,
        ref: "Game",
      },
    },
  ],
});

// Create the User model
const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", userSchema);

export default User;
