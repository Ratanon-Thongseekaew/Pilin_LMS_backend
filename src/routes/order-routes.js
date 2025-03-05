const express = require("express")
const orderRouters = express.Router()
const orderControllers = require("../controllers/order-controllers")
const { authCheck} = require("../middlewares/auth-middlewares")
const upload = require("../middlewares/upload")

//create order 
orderRouters.post("/",authCheck,orderControllers.createOrder)
orderRouters.post("/:orderId/payment",authCheck,upload.single("paymentSlip"),orderControllers.uploadPaymentSlip)
orderRouters.get("/user/:userId",authCheck,orderControllers.getUserOrders)


module.exports = orderRouters