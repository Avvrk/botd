import Bot from "../models/bot.mjs";

const commands = {
  setChannel: async (message, guild_id, daily_channel) => {
    try {
      await Bot.findOneAndUpdate(
        { guild_id: message.guild.id }, // Buscar por guild_id
        { daily_channel: message.channel.id }, // Datos a actualizar
        { upsert: true, new: true, setDefaultsOnInsert: true } // Crear si no existe
      );

      await message.channel.send("✅ Canal configurado correctamente.");
    } catch (error) {
      console.error(error);
      await message.channel.send("❌ Error al configurar el canal.");
    }
  },
};

export default commands;

