import express from "express"
import employeesController from "../controllers/employeesController.js"

//De la libreria Express utilixo Router()
//que es para colocar los metodos HTTP (get, post, put, delete)

const router = express.Router();

router.route("/")
.get(employeesController.getEmployees)

router.route("/:id")
.put(employeesController.updateEmployee)
.delete(employeesController.deleteEmployee);

export default router;