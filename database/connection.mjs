import mongoose from "mongoose";

const db_connection = async () => {
    try {
        await mongoose.connect(process.env.CNNTM);
        console.log("Conexión a base de datos establecida");
    } catch (error) {
        console.log(error);
        console.log("Error al conectar la base de datos:", error);
    }
};

export default db_connection;