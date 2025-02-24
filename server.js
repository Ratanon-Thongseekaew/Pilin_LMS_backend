require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const app = express();
const errorhandler = require("./src/middlewares/errorHandler")
const authRouters = require("./src/routes/auth-routes");
const notFound = require("./src/middlewares/notFound");
const courseRouter = require("./src/routes/course-routes");
const userRouters = require("./src/routes/user-routes");
//middlewares
app.use(cors()); // allow cross domain connection
app.use(morgan("dev")); // show log on terminal
app.use(express.json()); //for reading JSON

//routing
//1.auth-route
app.use(authRouters)
app.use(courseRouter)
app.use("/user",userRouters)
// app.use("/payment")(order)
// app.use("/cart",)
//2.course-route


//import error
app.use(notFound)
app.use(errorhandler)
// start server
const PORT = 8989
app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`))

