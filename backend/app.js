import express from "express"
import pizzaRoutes from "./src/routes/pizza.js"
import brancheRoutes from "./src/routes/branche.js"
import employeesRoutes from "./src/routes/employee.js"
import reviewsRoutes from "./src/routes/review.js"

//Crear una constante que el igual a
//la libreria Express
const app = express();

//Para que la API acepte json
app.use(express.json());

app.use("/api/pizzas", pizzaRoutes)
app.use("/api/branches", brancheRoutes)
app.use("/api/employee", employeesRoutes)
app.use("/api/review", reviewsRoutes)


export default app;