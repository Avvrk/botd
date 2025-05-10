import axios from "axios";

export default async function getPhrase() {
  const res = await axios.get(
    "https://frasedeldia.azurewebsites.net/api/phrase"
  );
  return res.data;
}
