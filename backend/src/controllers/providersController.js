import providerModel from "../models/providers.js";
import { v2 as cloudinary} from "cloudinary";

//Array de funciones
const providerController = {}

//SELECT
providerController.getAllProviders = async (req, res) => {
    try{
        const providers = await providerModel.find()
        return res.status(200).json(providers)
    } catch (error){
        console.log("error" +error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

//INSERT
providerController.insertProviders = async (req, res) => {
    try {
        //#1- Solicito los datos
        const {name, phone} = req.body

        const newProvider = new providerModel({
            name,
            phone,
            image: req.file.path,
            public_id: req.file.filename
        });

        await newProvider.save();

        return res.status(200).json({message: "Provider saved"})
    } catch (error) {
        console.log("error" +error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

//UPDATE
providerController.updateProvider = async (req, res) => {
    try {
        //#1- Solicito los nuevos datos
        const {name, phone} = req.body;

        //Identifico a quien estoy actualizando
        const providerFound = await providerModel.findById(req.params.id)

        const updatedData = {
            name,
            phone
        }

        //Si viene alguna imagen
        if(req.file){
            //Eliminar la imagen anterior
            await cloudinary.uploader.destroy(providerFound.public_id)

            //Guardo la nueva imagen
            updatedData.image = req.file.path
            updatedData.public_id = req.file.filename
        }

        //Actualizamos los valores en la base de datos
        await providerModel.findByIdAndUpdate(
            req.params.id,
            updatedData,
            {new: true}
        )

        return res.status(200).json({message: "Provider updated"})
    } catch (error) {
        console.log("error" +error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

