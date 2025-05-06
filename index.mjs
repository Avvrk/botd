import "./bot.js";
import express from "express";
import cors from "cors";
import db_connection from "./database/connection.mjs";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bot de Discord activo.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
		await db_connection();
		console.log(`Puerto: ${process.env.PORT}`);
	} catch (error) {
		console.log(`Error: ${error}`);
	};
});
