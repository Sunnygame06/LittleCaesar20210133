import dotenv from "dotenv"

//ejecutamos la libreria dotenv
dotenv.config();

export const config = {
    JWT: {
        secret: process.env.JWT_Secret_ket,
    },
};