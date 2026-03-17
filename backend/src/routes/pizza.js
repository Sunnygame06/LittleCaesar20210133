import express from "express";
import pizzasController from "../controllers/pizzaController.js";

//Router() nos ayuda a colocar los metodos
//que tendra el endpoint
const router = express.Router()

router.route("/")
.get(pizzasController.getPizzas)
.post(pizzasController.insertPizzas)

router.route("/:id")
.put(pizzasController.updatePizzas)
.delete(pizzasController.deletePizzas)

export default router