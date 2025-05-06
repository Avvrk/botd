import Discord from "discord.js";
import axios from "axios";
import cron from "node-cron";
import { Client } from "discord.js";
import { createClient } from "pexels";
import "dotenv/config";

import bot from "./commands/bot.mjs"

const pexels = createClient(process.env.PEXELS_TOKEN);
const client = new Client({ intents: 53608447 });

client.on("ready", () => {
  console.log(`Encendido como: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!establecerCanal")) {
    bot.setChannel(message)
  }
});

cron.schedule("0 8 * * *", async () => {
  const temas = [
    "clouds",
    "adventure",
    "calm",
    "sunset",
    "architecture",
    "cloudy",
    "coast",
    "blue sky",
    "landscape",
    "nature",
    "mountains",
    "forest",
  ];
  const query = temas[Math.floor(Math.random() * temas.length)];
  const foto = await pexels.photos.search({
    query,
    per_page: 10,
    orientation: "landscape",
  });
  const img = foto.photos[Math.floor(Math.random() * foto.photos.length)];

  const embed = new Discord.EmbedBuilder()
    //   .setTitle(titulo)
    .setImage(img.src.original)
    .setDescription(`> *"${r.data.phrase}"*\n> — **${r.data.author}**`)
    .setColor(img.avg_color || "#0099ff")
    .setFooter({
      text: `Foto de ${img.photographer} • Vía Pexels`,
      iconURL: "https://images.pexels.com/lib/api/pexels.png",
    });

  if (daily_channel) {
    const canal = await client.channels.fetch(daily_channel);
    canal.send({ embeds: [embed] });
  }
}, {
  scheduled: true,
  timezone: "America/Bogota"
});

client.login(process.env.BOT_TOKEN);
