import { Router } from "express";

const router = Router();

router.get("/ping", (req, res) => {
  setTimeout(async () => {
    await axios.get("https://experimento-5nzk.onrender.com/ping");
  }, 5 * 60 * 1000);
});

export default router;
