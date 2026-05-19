import express from "express";
import pizzasController from "../controllers/pizzaController.js";

//Router() nos ayuda a colocar los metodos
//que tendra el endpoint
const router = express.Router()

router.route("/")
.get(pizzasController.getPizzas)
.post(pizzasController.insertPizzas)

router.route("/low-stock")
.get(pizzasController.getLowStock)

router.route("/price-range")
.post(pizzasController.getPizzasByPriceRange)

router.route("/count")
.post(pizzasController.countPizzas)

router.route("/search-name")
.post(pizzasController.searchByName)

router.route("/:id")
.put(pizzasController.updatePizzas)
.delete(pizzasController.deletePizzas)
.get(pizzasController.getPizzasById)

export default router