import cartModel from "../models/cart.js"
import pizzasModel from "../models/pizzas.js"

const cartController = {}

cartController.getAllCarts = async (req,res) => {
    try {
        
        const carts = await cartModel.find().populate("customerId", "name email").populate("products.productId","name")

        return res.status(200).json(carts)
    
    } catch (error) {
         console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
        }
 }

 //INSERT
 cartController.insertCart = async(req,res) => {
    try {
        
        //Solicito los datos
        const {customerId, products, status} = req.body

        //Variable para guardar el total 
        let total = 0

        //Array de productos 
        let newProducts = []

        //De todos los productos que me envie el frontend 
        //Los voy a recorrer uno por uno para calcular el subtotal y el total

        for(let i = 0;  i < products.length; i++){
            {
                //Buscar  el producto en la base de datos
                const pizzaFound = await pizzasModel.findById(products[i].productId)

                //Calcular el subTotal
                const subtotal = pizzaFound.price * products[i].quantity;


                //Calcular total
                total += subtotal 

                //guardamos el producto junto con la cantidad y el subtotal
                newProducts.push({
                    productId: products[i].productId,
                    quantity: products[i].quantity,
                    subtotal: subtotal
                })

            }
        } 

        //Llenamos el model
        const newCart = new cartModel({
            customerId,
            products:  newProducts,
            total,
            status
        })

        await newCart.save()

        return res.status(200).json({message: "Cart created"})

    } catch (error) {
         console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
   }
 
cartController.updateCart = async(req,res) => {
    try {
        
        //Solicitamos los nuevos datos
        const {customerId, products, status} = req.body;

        //Variable para el total
        let total = 0

        //Arreglo de productos
        let newProducts = []

        //Recorrer todos los productos 
        for (let i = 0; i < products.length; i++){
            const pizzaFound = await pizzasModel.findById(products[i].productId)

            //Calcular subtotal
            const subTotal = pizzaFound.price * products[i].quantity

            //Sumar el total
            total  += subTotal

            //Guardamos el producto junto con su subtotal
            newProducts.push({
                productId: products[i].productId,
                quantity: products[i].quantity,
                subTotal: subTotal
            })
        }

        //Actualizar el carrito en la base de datos
        const updateCart = await cartModel.findByIdAndUpdate(
            req.params.id,{
                customerId,
                products: newProducts,
                total,
                status
            },
        { new: true},
    );

    return res.status(200).json({message: "cart updated"})

    } catch (error) {
         console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

cartController.deleteCart = async (req,res) => {
    try {

        await cartModel.findByIdAndDelete(req.params.id)

        return res.status(200).json({message: "cart deleted"})

    } catch (error) {
         console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}



 export default cartController;