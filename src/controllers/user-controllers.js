const createError = require("../utils/create-errors");
const prisma = require("../configs/prisma");
const bcrypt = require("bcryptjs");

//get UserMe (Done)
exports.userGetme = async (req, res, next) => {
  try {
    const { email } = req.user;
    console.log(email);
    const profile = await prisma.user.findFirst({
      where: { email: email },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
      },
    });
    console.log(profile);
    res.json({
      message: `Hello ${profile.firstname}`,
      result: profile,
    });
  } catch (error) {
    next(error);
  }
};
//update user(Done)
exports.userUpdate = async (req, res, next) => {
    try {
      if (!req.user) {
        return createError(401, "Unauthorized, please login");
      }
      const { firstname, lastname, email, password } = req.body;
      const updateData = {};
      if (firstname) updateData.firstname = firstname;
      if (lastname) updateData.lastname = lastname;
      if (email) updateData.email = email;
      if (password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        updateData.password = hashedPassword;
      }
  const updatedUser = await prisma.user.update({
      where:{id:req.user.id},
      data: updateData,
  });
      res.json({
        message: "User Update Successfully",
        userUpdate: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  };
//
//Delete User(Done)
exports.userDelete = async (req, res, next) => {
    try {
        if(!req.user){
            return createError(401, "Unauthorized, please login");
        }
        await prisma.user.delete({
            where: {id:req.user.id},
        })
      res.json("Your Account is successfully deleted");
    } catch (error) {
      next(error);
    }
  };

  //get all course list(done)
exports.userGetCourseLists = async (req, res, next) => {
    try {
        const {category} = req.params;
        const {page = "1", limit ="25"} = req.query;
        
        if(!category){
            return createError(400,"category must be provided")
        }
        if(isNaN(Number(page))|| isNaN(Number(limit))){
            return createError(400, "invalid type for page or limit")
        }
        const skip = (Number(page)-1) * Number(limit);
        const courses = await prisma.course.findMany({
            where:{
                category:{
                    name:category
                },
                // เชื่อมตารางเพื่อหาชื่อของ category
            },
                select:{
                    id: true,
                    title: true,
                    instructor: true,
                    price: true,
                    createdAt: true,
                    category:{
                        select:{
                            name:true
                        }
                    },
                },
          
           
            orderBy: {
                createdAt: "desc"
            },
            skip:skip,
            take:Number(limit),
        });
            res.status(200).json({courses})
        } catch (error) {
            next(error)
        }
        
        }
//get a course(done)
exports.userGetCourse = async (req, res, next) => {
    const {courseId: id} = req.params
    //courseId : id เปลี่ยนชื่อใน destructuring
    try {
        if(!id){
            return createError(400, "course ID Must be provided")
        }
        if(isNaN(Number(id))){
            return createError(400, "Invalid ID")
        }
        const getCourse = await prisma.course.findFirst({
                where:{
                    id: Number(id)
                },
                select:{
                    id:true,
                    title:true,
                    instructor: true,
                    length: true,
                    price: true,
                    thumbnails:true,
                    category:{
                        select:{
                            id:true,
                            name:true
                        }
                    }
                }
            })
        res.json({getCourse })
    } catch (error) {
        next(error)
    }
};

exports.userGetEveryCourses = async(req, res, next) =>{
  try {
    const { page = "1", limit = "25" } = req.query;

    if (isNaN(Number(page)) || isNaN(Number(limit))) {
        return next(createError(400, "Invalid type for page or limit"));
    }

    const skip = (Number(page) - 1) * Number(limit);

    const courses = await prisma.course.findMany({
        select: {
            id: true,
            title: true,
            instructor: true,
            thumbnails:true,
            price: true,
            createdAt: true,
            updatedAt: true,
            category: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        skip: skip,
        take: Number(limit),
    });

    console.log("✅ Fetching all courses...");
    console.log(courses);

    res.status(200).json({ courses });
} catch (error) {
    next(error);
}
}