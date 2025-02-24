# Server
## step1 
```bash 
npm init -y 
```
## step 2 install nodemon 
```bash
npm install express nodemon cors morgan bcryptjs jsonwebtoken zod prisma
```
## step 2.1 install prisma 
```bash
npx prisma init
```

## Step 3 Git 
```bash
git init 
git add . 
git commit - m "your_message"
```
next step 
coy code from your repo
```bash
git remote add origin https://github.com/Ratanon-Thongseekaew/CC19_front_to_back_api.git
git branch -M main
git push -u origin main
```

when update code 
```bash 
git add . 
git commit -m "message"
git push
```

## Step 4 Add Script in package.json
```bash
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon index.js"
  },
```
## Step 5 Import Middlewares on Javascript  

```bash

const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const app =express();



//middlewares
app.use(cors()); // allow cross domain connection
app.use(morgan("dev")); // show log on terminal
app.use(express.json()); //for reading JSON


//start server
const PORT = 8000
app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`))
```
## step 6 : create routing and controlllers




## Step 7 create Error handler
/middleware/error.js
```js
const handleErrors = (err,req,res,next) =>{
//code 
res
.status(err.statusCode || 500)
.json({message: err.message || "something is wrong!!"});

};
module.exports =handleErrors;
```
and use in index.js
```js
//import handleError function
const handleErrors = require("./src/middlewares/error")
//use handleError
app.use(handleErrors)
```
and update your try catch
```js
exports.login = (req,res,next)=>{
    //code
try {
    console.log(aaaaaaaa)
    res.json({message: "hello Login"})
} catch (error) {
    next(error)
}

}
update your code 
```bash
git add . 
git commit -m "your message"
git push
```
## Step 8: build function named "createError"
```bash
const createErrors = (code,message)=>{
    console.log("step 1 create error")
    const error = new Error(message)
    error.statusCode = code
    throw error;
};

module.exports = createErrors;
```

## Step 9 use Zod for Error Validate

import and call Zod
```bash
const { z } = require("zod")
//test validator
const validateWithZod = ()=> (req,res,next)=>{
try {
    console.log("hello, middlewares")
    next();
} catch (error) {
    next(error);
}
}
//validateWithZod = ()=> (req,res,next) เขียนเพราะจะได้รับ parameters ได้ 
```

Use Zod in router
```bash
Authrouter.post('/register', validateWithZod(), authControllers.register)


```

# Step 9.5 create condition with Zod Validators
/middlewares/validators.js
```bash
const { z, Schema } = require("zod")
//test validator

exports.registerSchema =z.object({
    email: z.string().email(),
    firstname: z.string().min(3, "firstname must contain at least 3 characters"),
    lastname: z.string().min(3,"lastname must contain at least 3 characters"),
    password: z.string().min(6, "password must contain at least 6 characters"),
    confirmPassword:  z.string().min(6, "password must contain at least 6 characters")
}).refine((data)=> data.password === data.confirmPassword,{
    message: "Password Is NOT Matched",
    path: ["confirmPassword"]

})

exports.loginSchema =z.object({
    email: z.string().email(),
    password: z.string().min(6, "password must contain at least 6 characters"),
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
```

## Step 10 : Create Prisma Model

Example: 
```bash

enum Role {
  USER
  ADMIN
}

model Profile {
  id        Int      @id @default(autoincrement())
  firstname String   @db.VarChar(25)
  lastname  String   @db.VarChar(25)
  email     String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

```

## Step 11 : Migrate your code with databases
```bash
npx prisma migrate dev --name init
```

## Step 12 : Create PrismaClient
create /config/prisma.js
```bash 
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = prisma;
```

## Step13: Encrypt with BcryptJs
Import bcryptjs 
```bash
const bcrypt = require("bcryptjs")
```
Js Coding [register update]
```bash 
              const checkEmail = await prisma.profile.findFirst({
         where:{
             email:email,
         },
        });
        console.log(checkEmail);
        if(checkEmail){
            return createErrors(400, "email is already exist! ")
        }
        //step 4 encrypt bcrypt
        // const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password,10)
        console.log(hashedPassword)
        //step 5 insert to DB 
        const profile = await prisma.profile.create({
            data:{
                email:email,
                firstname:firstname,
                lastname:lastname,
                password:hashedPassword
            }
        })
        //step 6 reqsponse
    res.json({message: "Register Success"})
    } catch (error) {
        console.log("step2 catch error")
        next(error)
    }
}
 ```
## Step 14 Create user Routes
```bash
const express = require("express")
const userRouter = express.Router();
//import controller
const userController = require("../controllers/user-controller")


// @endpoint http://localhost:8000/api/users

userRouter.get('/users',userController.listUsers);
userRouter.patch('/user/update-role',userController.updateRole);
userRouter.delete('/user/:id',userController.deleteUser)

module.exports = userRouter
```
## Step 14.5 Call it at index.js
```bash
app.use("/api/",userRouter)
```


### ENV Guide
PORT = 8989 
DATABASE_URL = ***
JWT_SECRET =  ***
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
--- 
### Service
| Path | Method | Authen | params | query | body |  
|:--|:--|:--|:--|:--  |:--
USER-Auth checked
/home |-|-|-|-|-|
|/auth/register |post|-|-|-| {email,firstname,lastname,password,confirmPassword}
|/auth/login|post|-|-|-| {email,password}
|/auth/current-user|get|y|-|-|-|
USER-COURSE
|/me|get|y|-|-|-|
|/course|get|y|-|-|-|
|/course|get|y|-|-|-|
|/course/detail|get|y|:id|-|-|
|/course/payment/order|post|y|:id|-|-|
|/course/learn/order|post|y|:id|-|-|
USER-CART
/Cart|get|y|-|-|-|
/Cart|post|y|-|-|-|
/Cart|delete|y|-|-|-|
ADMIN-COURSE
|/allcourse|get|y|-|-|-|
|/course|get|y|:id|-|-|
|admin/course|post|y|-|:id|{title,description,link,length}
|admin/course|patch|y|-|:id|{title,description,link,length}
|admin/course|delete|y|-|:id|
ADMIN-DASHBOARD
|admin/dashboard|get|y|-|-|-|
ADMIN-MANAGE
|admin/manage/alluser|get|y|-|-|-|
|admin/manage/user|get|y|-|:id|-|
|admin/manage/user|post|y|-|:id| {email,firstname,lastname,password,confirmPassword}|
|admin/manage/user|patch|y|-|:id| {email,firstname,lastname,password,confirmPassword}|
|admin/manage/user|delete|y|-|:id|-|


