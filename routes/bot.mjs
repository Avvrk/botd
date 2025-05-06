import { Router } from "express"
import httpBot from "../controllers/bot.mjs"

const router = Router()

router.get("/ping", httpBot.getPing);

export default router;