import axios from "axios"
import cron from "node-cron";

const httpBot = {
    getPing: async (req, res) => {
        try {
            res.send('Pong from A');
        } catch (error) {
            res.json({ err: error.message})
        }
    }
}

cron.schedule('*/5 * * * *', async () => {
    try {
      const res = await axios.get("https://experimento-5nzk.onrender.com/ping")
      console.log('✅ Backend A envió ping a Backend B:', res.data);
    } catch (err) {
      console.error('❌ Error en Backend A al pingear B:', err.message);
    }
});

export default httpBot;