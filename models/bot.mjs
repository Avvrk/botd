import mongoose from "mongoose";

const botSchema = new mongoose.Schema({
  guild_id: { type: String, required: true, unique: true }, // ID del servidor
  daily_channel: { type: String, required: true },
});

export default mongoose.model("Bot", botSchema);
