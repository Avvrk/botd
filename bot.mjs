import axios from "axios";
import cron from "node-cron";
import { Client, EmbedBuilder } from "discord.js";
import { createClient } from "pexels";
import "dotenv/config";
import Bot from "./models/bot.mjs";

import bot from "./commands/bot.mjs";

const pexels = createClient(process.env.PEXELS_TOKEN);
const client = new Client({ intents: 53608447 });

client.on("ready", () => {
  console.log(`Encendido como: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!establecerCanal")) {
    bot.setChannel(message);
  }
});

cron.schedule(
  "*/15 * * * * *",
  async () => {
    const r = await axios.get("https://frasedeldia.azurewebsites.net/api/frases");
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
    console.log(foto, "hola")
    const img = foto.photos[Math.floor(Math.random() * foto.photos.length)];

    const embed = new EmbedBuilder()
      //   .setTitle(titulo)
      .setImage(img.src.original)
      .setDescription(`> *"${r.data.phrase}"*\n> — **${r.data.author}**`)
      .setColor(img.avg_color || "#0099ff")
      .setFooter({
        text: `Foto de ${img.photographer} • Vía Pexels`,
        iconURL: "https://images.pexels.com/lib/api/pexels.png",
      });

    const configuraciones = await Bot.find();
    for (const config of configuraciones) {
      try {
        const canal = await client.channels.fetch(config.daily_channel);
        if (canal && canal.isTextBased()) {
          await canal.send({ embeds: [embed] });
        }
      } catch (error) {
        console.error(
          `Error al enviar mensaje a ${config.daily_channel}:`,
          error
        );
      }
    }
  },
  {
    scheduled: true,
    timezone: "America/Bogota",
  }
);

client.login(process.env.BOT_TOKEN);
