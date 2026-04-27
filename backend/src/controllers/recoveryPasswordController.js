import jsonwebtoken from "jsonwebtoken"; //Generar tokens
import bcrypt from "bcryptjs"; //Encriptar la contraseña
import crypto from "crypto"; //Generar codigos aleatorios
import nodemailer from "nodemailer"; //Enviar correos

import HTMLRecoveryEmail from "../utils/sendEmailRecovery.js";

import {config} from "../../config.js";

import customerModel from "../models/customers.js"

//Array de funciones
const recoveryPasswordController = {}

recoveryPasswordController.requestCode = async (req, res) => {
    try {
        //#1- Solicitampos los datos
        const {email} = req.body;

        //Validar que el correo si exista en la bd
        const userFound = await customerModel.findOne({email});

        if(!userFound){
            return res.status(404).json({message: "User not found"})
        }

        //Generamos un codigo aleatorio
        const randomCode = crypto.randomBytes(3).toString("hex")

        //Guardamos todo en un token
        const token = jsonwebtoken.sign(
            //#1- ¿Que vamos a guardar?
            {email, randomCode, userType: "customer", verified: false},
            //#2- Secret Key
            config.JWT.secret,
            //#3- ¿cuandop expira?
            {expiresIn: "15m"}
        )

        res.cookie("recoveryCookie", token, {maxAge: 15 * 60 * 1000});

        //Enviar el codigo por correo electronico
        //#1- ¿Quien lo envia?
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth:{
                user: config.email.user_email,
                pass: config.email.user_password
            }
        })

        //#2- ¿Quien lo recibe y como lo recibe?
        const mailOptions = {
            from: config.email.user_email,
            to: email,
            subject: "Recuperacion de contraseña",
            body: "El codigo vence en 15 minutos",
            html: HTMLRecoveryEmail(randomCode),
        };

        //#3- Enviar correo electronico
        transporter.sendMail(mailOptions, (error, info)=>{
            if(error){
                console.log("error"+error)
                return res.status(500).json({message: "Error sending email"})
            }
            return res.status(200).json({message: "email sent"})
        })
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"});
    }
};

recoveryPasswordController.verifyCode = async (req, res) => {
    try {
        
        //#1- Solicitamos los datos
        const {code} = req.body;

        //Obtenemos la informacion que esta dentro del token
        //Accedemos a la cookie
        const token = req.cookies.recoveryCookie
        const decoded = jsonwebtoken.verify(token, config.JWT.secret)

        //Ahora, comparar el codigo que el usuario escribio
        //con el que esta guardado en el token
        if(code !== decoded.randomCode){
            return res.status(400).json({message: "Invalid Code"})
        }

        //En cambio, si escribe bien el codigo
        //vamos a colocar en el token que ya esta verificado
        const newToken = jsonwebtoken.sign(
            //#1- ¿Que vamos a guardar?
            {email: decoded.email, userType: "customer", verified: true},
            //#2- Secret Key
            config.JWT.secret,
            //#3- ¿Cuando expira?
            {expiresIn: "15m"}
        );

        res.cookie("recoveryCookie", newToken, {maxAge: 15 * 60 * 1000});

        return res.status(200).json({message: "Code verified successfully"});

    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

recoveryPasswordController.newPassword = async (req, res) => {
    try {
        const {newPassword, confirmNewPassword} = req.body;

        //Comparo las dos contraseñas
        if(newPassword !== confirmNewPassword){
            return res.status(400).json({message: "Password doesnt match"})
        }

        //Vamos a comprobar que la constante verified que esta en el token
        //ya este en true (O sea que haya pasado por el paso 2)
        const token = req.cookies.recoveryCookie
        const decoded = jsonwebtoken.verify(token, config.JWT.secret)

        if(!decoded.verified){
            return res.status(400).json({message: "Code not verified"})
        }

        ///////
        //Encriptar la contraseña
        const passwordHash = await bcrypt.hash(newPassword, 10)

        //Actualizar la contraseña en la base de datos
        await customerModel.findOneAndUpdate(
            {email: decoded.email},
            {password: passwordHash},
            {new: true}
        )

        res.clearCookie("recoveryCookie")

        return res.status(200).json({message: "Password Updated"})

    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

export default recoveryPasswordController;