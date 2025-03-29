const express = require("express")
const orderRouters = express.Router()
const orderControllers = require("../controllers/order-controllers")
const { authCheck} = require("../middlewares/auth-middlewares")
const upload = require("../middlewares/upload")

//create order 
orderRouters.get("/user/allorder",authCheck,orderControllers.getAllOrders)
orderRouters.post("/",authCheck,orderControllers.createOrder)
orderRouters.post("/:orderId/payment",authCheck,upload.single("paymentSlip"),orderControllers.uploadPaymentSlip)
orderRouters.get("/user/:userId",authCheck,orderControllers.getUserOrders)
orderRouters.put("/:orderId/status",authCheck,orderControllers.updateOrderStatus)

//payment stripe
orderRouters.post("/checkout/:id",authCheck,orderControllers.checkOut)

module.exports = orderRouters