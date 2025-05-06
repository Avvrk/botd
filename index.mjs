import "./bot.mjs";
import express from "express";
import cors from "cors";
import db_connection from "./database/connection.mjs";
import Bot from "./routes/bot.mjs"
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/bot", Bot);

app.get("/", (req, res) => {
  res.send("Bot de Discord activo.");
});

app.listen(process.env.PORT, async () => {
  try {
		await db_connection();
		console.log(`Puerto: ${process.env.PORT}`);
	} catch (error) {
		console.log(`Error: ${error}`);
	};
});
