const createError = require("../utils/create-errors");
const jwt = require("jsonwebtoken");
exports.authCheck = async (req,res,next) =>{
try {
    //code
    //รับ headers จาก CLIENT
    const authorization = req.headers.authorization
    console.log(authorization)
    //CHECK ถ้าไม่มี token (missing token)
    if(!authorization){
        return createError(400, "something went wrong")
    }
    const token = authorization.split(" ")[1]
    //verify token
    jwt.verify(token,process.env.SECRET_KEY,(err,decode)=>{
    console.log(err)
    console.log(decode)
    if(err){
        return createError(401, "Unauthorized")
    }
    req.user = decode
    next()
    })

} catch (error) {
    next(error);
}

}