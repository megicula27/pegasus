import mongoose, { Schema, Model, Document } from "mongoose";

// Define the IGame interface
interface IGame extends Document {
  name: string;
  teamSize: number;
}

// Define the game schema
const gameSchema: Schema<IGame> = new Schema({
  name: {
    type: String,
    required: true,
  },
  teamSize: {
    type: Number,
    required: true,
  },
});

// Create the Game model
const Game: Model<IGame> =
  (mongoose.models.Game as Model<IGame>) ||
  mongoose.model<IGame>("Game", gameSchema);

export default Game;
