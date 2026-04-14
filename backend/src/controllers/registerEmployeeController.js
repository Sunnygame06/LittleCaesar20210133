import nodemailer from "nodemailer"
import crypto from "crypto"
import jsonwebtoken from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import { config } from "../../config.js"

import employeeModel from "../models/employees.js"

const registerEmployeeController = {};

registerEmployeeController.register = async (req, res) => {
    try{
        const {name, lastname, DUI, birthdate, email, password, isVerified, status, idBranches} = req.body;

        const exitsEmployee = await employeeModel.findOne({email});
        if(exitsEmployee){
            return res.status(400).json({message: "Employee already exits"})
        }

        const passwordHashed = await bcryptjs.hash(password, 10)

        const randomCode = crypto.randomBytes(3).toString("hex")

        const token = jsonwebtoken.sign(
            {
                randomCode,
                name,
                lastname, 
                DUI, 
                birthdate, 
                email, 
                password, 
                isVerified, 
                status, 
                idBranches
            },

            config.JWT.secret,

            {expiresIn: "15m"}
        );

        res.cookie("EmployeeCookie", token, {maxAge: 15 * 60 * 1000})

        const Transporter = nodemailer.createTransport ({
            service: "gmail",
                auth: {
                    user: config.email.user_email,
                    pass: config.email.user_password
                },
        });

        const mailOptions = {
                from: config.email.user_email,
                to: email,
                subject: "Verificacion de cuenta",
                text: "Para verificar tu cuenta, utiliza este codigo "+
                randomCode +" expira en 15 minutos"
        };

        Transporter.sendMail(mailOptions, (error, info)=>{
            if(error){
                console.log("error"+error)
                return res.status(500).json({message: "Error sending email"})
            }

            return res.status(200).json({message: "Email sent"})
        })
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

registerEmployeeController.verifyCode = async (req, res) => {
    try{
        const {verificationCodeRequest} = req.body;

        const token = req.cookies.EmployeeCookie

        const decoded = jsonwebtoken.verify(token, config.JWT.secret);
        const {
            randomCode: storedCode,
            name,
            lastname, 
            DUI, 
            birthdate, 
            email, 
            password, 
            isVerified, 
            status, 
            idBranches
        } = decoded

        if(verificationCodeRequest !== storedCode){
            return res.status(400).json({message: "Invalid Code"})
        }

        const newEmployee = employeeModel({
            name,
            lastname, 
            DUI, 
            birthdate, 
            email, 
            password, 
            isVerified: true, 
            status, 
            idBranches
        });

        await newEmployee.save();

        res.clearCookie("EmployeeCookie")

        return res.status(200).json({message: "Employee registered"})
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

export default registerEmployeeController;