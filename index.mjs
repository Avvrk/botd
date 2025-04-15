import Discord, { ClientPresence } from "discord.js";
import axios from "axios";
import cron from "node-cron";
import { Client } from "discord.js";
import { createClient } from "pexels";
import "dotenv/config";

const pexels = createClient(process.env.PEXELS_TOKEN);
const client = new Client({ intents: 53608447 });
let daily_channel;

client.on("ready", () => {
  console.log(`Encendido como: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.content === "!hola") {
    //   message.channel.send(`¡Hola! <@&${1357516428139303148}> me la pelan`);
    const rol = message.guild.roles.cache.get("1005251908698656893");

    if (rol) {
      message.channel.send(`¡Hola! ${rol.toString()} me la pelan`);
    } else {
      message.channel.send("Ese rol no existe en este servidor.");
    }
  }

  if (message.content.startsWith("!ayuda")) {
    const mencionado = message.mentions.users.first();

    if (mencionado) {
      await message.channel.send(`Papi ${mencionado} no digas eso`);
    } else {
      await message.channel.send(
        "Debes mencionar a alguien para que lo pueda ayudar."
      );
    }
  }

  if (message.content.startsWith("!T")) {
    /* const titulos = [
      "🌄 Un Respiro para Hoy",
      "🧘‍♂️ Momento de Paz",
      "📸 Postales del Mundo",
      "💭 Pensamiento Diario",
      "🌅 Paisaje + Reflexión",
      "🌤️ Hoy se ve así...",
      "✨ Vibra del Día",
      "🗺️ Un Rincón del Mundo",
      "🌱 Belleza Natural",
      "📖 Palabras y Paisajes",
    ]; */
    // const titulo = titulos[Math.floor(Math.random() * titulos.length)];
  }

  if (message.content.startsWith("!establecerCanal")) {
    daily_channel = message.channel.id;
    console.log(daily_channel);
    await message.channel.send(
      "✅ Canal configurado para enviar frases diarias."
    );
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

  const r = await axios.get("https://frasedeldia.azurewebsites.net/api/phrase");

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
  timezone: "America/Colombia"
});

client.login(process.env.BOT_TOKEN);
