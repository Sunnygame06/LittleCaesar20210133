/*
    customerId
    products: 
        productsId
        Quantity
        subtotal
        total 
        status
*/  

import mongoose, { Schema,model } from "mongoose";


const cartSchema = new Schema({
    customerId: {
        type: mongoose.Types.ObjectId,
        ref: "Customers"
    },
    products:[
        {
            productId: {
                type: mongoose.Types.ObjectId,
        ref: "pizzas"
            },
            quantity:{
                type: Number
            },
            subtotal: {
                type: Number
            },
        
        }
    ],
    total: {
        type: Number
    },
    status: {
        type: String
    }
    },{ 
    timestamps: true,
    strict: false
})



export default model("cart", cartSchema);