const express = require("express")
const orderRouters = express.Router()
const orderControllers = require("../controllers/order-controllers")
const { authCheck} = require("../middlewares/auth-middlewares")

//create order 
orderRouters.post("/",authCheck,orderControllers.createOrder)

module.exports = orderRouters