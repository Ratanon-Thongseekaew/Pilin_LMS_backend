const {z} = require("zod")

exports.registerUser = z.object({
    email: z.string().email(),
    firstname: z.string().min(3, "firstname must contain at least 3 characters"),
    lastname: z.string().min(3,"lastname must contain at least 3 characters"),
    password: z.string().min(6, "password must contains at least 6 character."),
    confirmPassword:  z.string().min(6, "password must contain at least 6 characters")
}).refine((data)=> data.password === data.confirmPassword,{
    message: "Password Is NOT Matched",
    path: ["confirmPassword"]
})
exports.loginUser = z.object({
        email: z.string().email("Invalid email or password"),
        password: z.string().min(6, "Invalid email or password"),
    })

exports.validateWithZod = (schema)=> (req,res,next)=>{
    try {
        console.log("hello, middlewares");
        schema.parse(req.body)
        next(); 
    } catch (error) {
        const errMsg = error.errors.map((item)=>item.message)
        const errText = errMsg.join(", ")
        const mergeError = new Error(errText)
        console.log(error.errors)
        next(mergeError);    
    }
    }