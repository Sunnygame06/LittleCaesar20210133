const reviewController = {};

import reviewsModel from "../models/reviews.js"
import employeesController from "./employeesController.js";

//SELECT
reviewController.getReview = async (req, res) => {
    try{
        const reviews = await reviewsModel.find()
        return res.status(200).json(reviews)
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
}

//INSERT
reviewController.insertReview = async (req, res) => {
    try{
        let{
            idEmployee,
            idPizza,
            rating,
            comment
        } = req.body;

        //Validaciones
        if(rating > 5 || rating < 1){
            return res.status(400).json({message: "Invalid rating, only 1 to 5"})
        }

        if(comment.length > 500 || comment.length < 5){
            return res.status(400).json({message: "Invalid comment"})
        }

        const newReview = new reviewsModel({
            idEmployee,
            idPizza,
            rating,
            comment
        })

        await newReview.save();

        return res.status(201).json({message: "Review saved"})
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

//DELETE
reviewController.deleteReview = async (req, res) => {
    try{
        const deleteReview = await reviewsModel.findByIdAndDelete(req.params.id)

        if(!deleteReview){
            return res.status(404).json({message: "Review not found"})
        }

        return res.status(200).json({message: "Review deleted"})
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "internal server error"})
    }
};

//UPDATE
reviewController.updateReview = async (req, res) => {
    try{
        let{
            idEmployee,
            idPizza,
            rating,
            comment
        } = req.body;

        //Validaciones
        if(rating > 5 || rating < 1){
            return res.status(400).json({message: "Invalid rating, only 1 to 5"})
        }

        if(comment.length > 500 || comment.length < 5){
            return res.status(400).json({message: "Invalid comment"})
        }

        const reviewUpdated = await reviewsModel.findByIdAndUpdate(
            req.params.id,
            {
            idEmployee,
            idPizza,
            rating,
            comment,}, {new:true}
        );

        if(!reviewUpdated){
            return res.status(404).json({message: "review not found"})
        }

        return res.status(200).json({message: "Review updated"})
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

export default reviewController;