import express from "express";
import cors from "cors";
import cron from "node-cron";
import dbConnection from "./src/database/connection.mjs";
import keepAliveRoutes from "./src/routes/keepAlive.mjs";
import Bot from "./src/models/bot.mjs";
import cmBot from "./src/commands/bot.mjs";
import getPhoto from "./src/services/getPhoto.mjs";
import getPhrase from "./src/services/getPhrase.mjs";
import { Client, EmbedBuilder } from "discord.js";
import "dotenv/config";

const app = express();
const client = new Client({ intents: 53608447 });

app.use(cors());
app.use(express.json());
app.use("/", keepAliveRoutes);

app.listen(process.env.PORT, async () => {
  try {
    await dbConnection();
    console.log(`Puerto: ${process.env.PORT}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});

client.on("ready", () => {
  console.log(`Encendido como: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!establecerDiario")) {
    cmBot.setChannel(message);
  }
});

cron.schedule(
  "0 8 * * *",
  async () => {
    const img = await getPhoto();
    const frase = await getPhrase();

    const embed = new EmbedBuilder()
      .setImage(img.src.original)
      .setDescription(`> *"${frase.phrase}"*\n> — **${frase.author}**`)
      .setColor(img.avg_color)
      .setFooter({
        text: `Foto de ${img.photographer} • Vía Pexels`,
        iconURL: "https://images.pexels.com/lib/api/pexels.png",
      });

    const canales = await Bot.find();
    for (const config of canales) {
      try {
        const canal = await client.channels.fetch(config.daily_channel);
        if (canal && canal.isTextBased()) {
          await canal.send({ embeds: [embed] });
        }
      } catch (err) {
        console.error(`Error con canal ${config.daily_channel}:`, err);
      }
    }
  },
  {
    scheduled: true,
    timezone: "America/Bogota",
  }
);

client.login(process.env.BOT_TOKEN);
