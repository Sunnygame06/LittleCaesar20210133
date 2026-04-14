import express from "express"
import pizzaRoutes from "./src/routes/pizza.js"
import brancheRoutes from "./src/routes/branche.js"
import employeesRoutes from "./src/routes/employee.js"
import reviewsRoutes from "./src/routes/review.js"
import customerRoutes from "./src/routes/customer.js"
import registerCustomerRoutes from "./src/routes/registerCustomer.js"
import registerEmployeeRoutes from "./src/routes/registerEmployee.js"
import cookieParser from "cookie-parser"

//Crear una constante que el igual a
//la libreria Express
const app = express();

app.use(cookieParser());

//Para que la API acepte json
app.use(express.json());

app.use("/api/pizzas", pizzaRoutes);
app.use("/api/branches", brancheRoutes);
app.use("/api/employee", employeesRoutes);
app.use("/api/review", reviewsRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/registerCustomer", registerCustomerRoutes);
app.use("/api/registerEmployee", registerEmployeeRoutes)

export default app;