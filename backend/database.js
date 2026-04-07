import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/littleCaesar2DB")

//Comprobar que todo funciona

//Creo una constante que es igual a la conexion
const connection = mongoose.connection;

connection.once("open", ()=>{
    console.log("DB is connected")
})

connection.on("disconnected", ()=>{
    console.log("DB is disconnected")
})

connection.on("error", (error)=>{
    console.log("Error found" + error)
})