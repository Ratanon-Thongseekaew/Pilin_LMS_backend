const createError = require("../utils/create-errors")
const prisma = require("../configs/prisma")
const bcrypt =require("bcryptjs")
const jwt =require("jsonwebtoken")

exports.register = async (req,res,next)=>{
    //code
    try {
    //req.body
    const {email,firstname,lastname,password,confirmPassword} = req.body
      //step 2 validate 
        //step 3 check already 
        const checkEmail = await prisma.user.findFirst({
            where:{
                email:email,
            },
           });
           console.log(checkEmail);
           if(checkEmail){
            return createError(400, "email is already exist! ")
        }
         //step 4 encrypt bcrypt
        const salt = bcrypt.genSaltSync(10)

        const hashedPassword = bcrypt.hashSync(password,10)
        console.log(hashedPassword)
         //step 5 insert to DB 
         const profile = await prisma.user.create({
            data:{
                email:email,
                firstname:firstname,
                lastname:lastname,
                password:hashedPassword
            }
         })
        res.json({message: "Register Success"})

    } catch (error) {
        console.log("step2 catch error")
        next(error)
    }
}
exports.login = async  (req,res,next) =>{
//code
try {
    //step 1 : Req.body 
    const {email, password} = req.body;
    //step 2 : Check email and password 
    const profile = await prisma.user.findFirst({
        where:{
            email:email,
        },
    }); 
    if(!profile){
        return createError(400,"email or password is invalid")
    }
    const isMatch = bcrypt.compareSync(password,profile.password)
    console.log(isMatch)
    if(!isMatch){
        return createError(400,"email or password is invalid")
    }
    // console.log(profile);
    //step 3 : Generate Token
    const payload = {
        id: profile.id,
        email:profile.email,
        firstname:profile.firstname,
        lastname: profile.lastname,
        role:profile.role,
    };
    const token = jwt.sign(payload,process.env.SECRET_KEY,{
        expiresIn: "1d",
    })
    //Step 4 : Response
    res.json({message: "Login Success",
        payload:payload,
        token:token
    })
} catch (error) {
    next(error)
}

}
exports.currentUser = async (req, res, next) => {
    try {
      const { email } = req.user;
      console.log(email);
  const profile = await prisma.user.findFirst({
    where:{ email : email},
    select:{
      id: true,
      email: true,
      role: true
    }
  })
  console.log(profile);
      res.json({ result: profile });
    } catch (error) {
      next(error);
    }
  };