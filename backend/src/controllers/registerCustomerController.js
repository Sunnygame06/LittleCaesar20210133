import nodemailer from "nodemailer" //Enviar correos
import crypto from "crypto" //Generar codigo aleatorio
import jsonwebtoken from "jsonwebtoken" //Token
import bcryptjs from "bcryptjs" //Encriptar contraseña
import {config} from "../../config.js"

import customerModel from "../models/customers.js"

//array de funciones
const registerCustomerController = {};

registerCustomerController.register = async (req, res) => {
    try {
        //#1- Solicitar los datos a guardar
        const {
            name, 
            lastName, 
            birthdate, 
            email, 
            password, 
            isVerified, 
            loginAttemps, 
            timeOut} = req.body;

            //#2- Validar si el correo existe en la base de datos
            const exitsCustomer = await customerModel.findOne({email});
            if(exitsCustomer){
                return res.status(400).json({message: "Customer already exists"})
            }

            //Encriptar la contraseña
            const passwordHashed = await bcryptjs.hash(password, 10)

            //Generar un codigo aleatorio
            const randomCode = crypto.randomBytes(3).toString("hex")

            //Guardamos todo en un token
            const token = jsonwebtoken.sign(
                //#1- ¿Que vamos a guardar?
                {
                    randomCode,
                    name, 
                    lastName, 
                    birthdate, 
                    email, 
                    password: passwordHashed, 
                    isVerified, 
                    loginAttemps, 
                    timeOut
                },
                //#2- Secret key
                config.JWT.secret,
                //#3- ¿Cuando expira?
                {expiresIn: "15m"}
            ); 

            //guardamos el token en una cookie
            res.cookie("registrationCookie", token, {maxAge: 15 * 60 * 1000})

            //Enviar correo eleectronico
            //#1- Transporter -> ¿Quien lo envio?
            const Transporter = nodemailer.createTransport ({
                service: "gmail",
                auth: {
                    user: config.user_email,
                    pass: config.user_password
                },
            });

            //#2- mailOptions -> ¿Quien lo recibe y como?
            const mailOptions = {
                from: config.email.user_email,
                to: email,
                subject: "Verificacion de cuenta",
                text: "Para verificar tu cuenta, utiliza este codigo "+
                randomCode +" expira en 15 minutos"
            };

            //#3- Enviar el correo electronico
            Transporter.sendMail(mailOptions, (error, info)=>{
                if(error){
                    console.log("error")
                    return res.status(500).json({message: "Error sending email"})
                }

                return res.status(200).json({message: "Email sent"})
            })

    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

//Verificar el codigo que acabamos de enviar
registerCustomerController.verifyCode = async (req, res) => {
    try {
        //Solicitamos el codigo que el usuario escribio en el frontend
        const {verificationCodeRequest} = req.body;

        //Obtener el token de las cookies
        const token = req.cookies.registrationCookie

        //Extraer todos los datos del token
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);
        const{
            randomCode: storedCode,
            name,
            lastName,
            birthdate,
            email,
            password,
            isVerified,
            loginAttemps,
            timeOut
        } = decoded

        if(verificationCodeRequest !== storedCode){
            return res.status(400).json({message: "Invalid Code"})
        }

        //Si todo esta bien, y el usuario, lo registramos en la DB
        const newCustomer = customerModel({
            name, lastName, birthdate, email, password, isVerified: true,
        });

        await newCustomer.save();

        res.clearCookie("registrationCookie")

        return res.status(200).json({message: "Customer registered"})

    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

export default registerCustomerController;