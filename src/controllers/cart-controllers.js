const createError = require("../utils/create-errors")
const prisma = require("../configs/prisma")

exports.addtoCart =async(req,res,next)=>{
try {
    res.send({message: "Hello Add to Cart"})
} catch (error) {
    next(error)
}
}

exports.getCartItems = async(res,res,next)=>{
    try {
        res.send({message: "Hello Get Cart Items"})
    } catch (error) {
        next(error)
    }
}

exports.removefromCart =async(res,res,next)=>{
    try {
        res.send({message: "Remove from Cart"})
    } catch (error) {
        next(error)
    }
}
exports.clearCart = async(res,res,next)=>{
    try {
        res.send({message:"Clear Cart"})
    } catch (error) {
        next(error)

    }
}