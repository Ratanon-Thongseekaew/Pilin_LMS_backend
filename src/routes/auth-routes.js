const express = require("express")
const authRoutes = express.Router();
const authControllers =require("../controllers/auth-controllers");
const { validateWithZod, registerUser, loginUser } = require("../middlewares/validators");
const { authCheck } = require("../middlewares/auth-middlewares");
// const authControllers = require("../controllers/auth-controllers")

authRoutes.post("/register",validateWithZod(registerUser),authControllers.register);
authRoutes.post("/login",validateWithZod(loginUser),authControllers.login)
// authRoutes.post("login",);
authRoutes.get("/current-user",authCheck,authControllers.currentUser)


//export
module.exports = authRoutes;