

const express = require("express");
const cartRoutes = express.Router();
const cartControllers = require("../controllers/cart-controllers")
const {authCheck}= require("../middlewares/auth-middlewares")

//add to cart 
cartRoutes.get("/",authCheck,cartControllers.getAllCartItems)
cartRoutes.post("/",authCheck,cartControllers.addtoCart)
cartRoutes.delete("/:courseId",authCheck,cartControllers.removefromCart)
cartRoutes.delete("/",authCheck,cartControllers.clearCart)
module.exports = cartRoutes 