import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

import { config } from "../../config.js";

import customerModel from "../models/customers.js";

//Array de funciones
const loginCustomerController = {};

loginCustomerController.login = async (req, res) => {
    try {
        
        //#1- Solicitar los datos
        const {email, password} = req.body;

        //Verificar si el correo existe en la base de datos
        const customerFound = await customerModel.findOne({email})

        //Si no existe el correo
        if(!customerFound){
            return res.status(400).json({message: "Customer not found"})
        }

        //Verificamos que la cuenta no este bloqueada
        if(customerFound.timeOut && customerFound.timeOut > Date.now()){
            return res.status(403).json({message: "Blocked account"})
        }

        //Validar la contraseña
        const isMatch = await bcrypt.compare(password, customerFound.password)

        //Si la contraseña esta incorrecta
        if(!isMatch){
            //Sumar 1 a la cantidad de intentos fallidos
            customerFound.loginAttemps = (customerFound.loginAttemps || 0) + 1

            if(customerFound.loginAttemps >= 5){
                customerFound.timeOut = Date.now() + 5 * 60 * 1000;
                customerFound.loginAttemps = 0;

                await customerFound.save();

                return res.status(403).json({message: "Blocked account for many attemps"})
            }

            await customerFound.save();

            return res.status(401).json({message: "Wrong password"})
        }

        //Reseteamos intentos si el login es correcto
        customerFound.loginAttemps = 0;
        customerFound.timeOut = null;

        //Generar el token
        const token = jsonwebtoken.sign(
            //#1- ¿que vamos a guardar?
            {id: customerFound._id, userType: "customer"},
            //#2- secret key
            config.JWT.secret,
            //#3- Cuando expira
            {expiresIn: "30d"}
        )

        //El token lo guardamos en una cookie
        res.cookie("authCookie", token);

        return res.status(200).json({message: "Login successfully"})

    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

export default loginCustomerController;
