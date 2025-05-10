import { createClient } from "pexels";
import dotenv from "dotenv";

dotenv.config();

const pexels = createClient(process.env.PEXELS_TOKEN);

export default async function getPhoto() {
  const temas = [
    "nature",
    "landscape",
    "sunset",
    "mountains",
    "forest",
    "clouds",
    "sky",
    "calm",
    "coast",
    "architecture",
  ];
  const query = temas[Math.floor(Math.random() * temas.length)];

  const resultado = await pexels.photos.search({
    query,
    per_page: 10,
    orientation: "landscape",
  });

  return resultado.photos[Math.floor(Math.random() * resultado.photos.length)];
}
