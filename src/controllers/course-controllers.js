const createError = require("../utils/create-errors")
const prisma = require("../configs/prisma")
const { connect } = require("../routes/auth-routes")
const { number } = require("zod")
const courseService = require("../services/course-service")
exports.adminHome = async(req,res,next)=>{
    try {
    res.send("Hello Admin")
    } catch (error) {
        
    }
    
    }
//done
exports.adminGetAllCourses = async(req,res,next)=>{
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
console.log("123456 hahaha")
console.log(courses)
    res.status(200).json({courses})
} catch (error) {
    next(error)
}

}
//done
exports.adminGetCourse = async(req,res,next)=>{0
    const {courseId: id} = req.params
    //courseId : id เปลี่ยนชื่อใน destructuring
    try {
        if(!id){
            return createError(400, "course ID Must be provided")
        }
        if(isNaN(Number(id))){
            return createError(400, "Invalid ID admingetCourse")
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
}
//done
exports.adminCreateCourse = async (req,res,next)=>{
    try {
        const {title,categoryId,description,price,instructor,videoURL,length} = req.body
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }
    if(!req.user || req.user.role !== "ADMIN"){
        return createError(403,"Unauthorized")
    }
    // const categories = await prisma.category.findMany();
    // console.log("hi categoryABC",categories)
const newCourse = await prisma.course.create({
    data: {
        title:title,
        description:description,
        price:price,
        instructor:instructor,
        length:length,
        videoURL:videoURL,
        users:{
            connect:{
                id: req.user.id
            },
        },
        category:{
            connect:{
                id: categoryId,
            }
        }
    },
});
        res.json({
            message: "Create Successfully",
            course:newCourse});
    } catch (error) {
        next(error)
    }
}

//done
exports.adminUpdateCourse = async(req,res,next)=>{
    try {
        const {courseId:id} = req.params;
        console.log("This is ID",id)
        const {title,categoryId,description,price,instructor,videoURL,length}=req.body;
        if(!id){
            return createError(400, "course ID Must be provided")
        }
        if(isNaN(Number(id))){
            return createError(400, "Invalid ID")
        }
        const course = await courseService.getCoursebyId(id)
        if(!course){
            return createError(400, "course is not found");
        }
        await prisma.course.update({
            where: {
                id: course.id,
            },
            data: {
                title:title,
                description:description,
                instructor:instructor,
                length:length,
                price:price,
                videoURL:videoURL,
                category:{
                    connect:{
                        id: categoryId,
                    }
                }
            }
        })
        res.json({
            message: "Update Successfully",
            updatedCourse:course})
    } catch (error) {
        next(error)
    }
}

//done
exports.adminDeleteCourse = async(req,res,next)=>{
    try {
        const {courseId:id} = req.params
        console.log("Request.Body check",req.params)
        console.log("This is ID:",id)
        if(!id){
            return createError(400, "course ID Must be provided")
        }
        if(isNaN(Number(id))){
            return createError(400, "Invalid ID")
        }
        const course = await courseService.getCoursebyId(id)
        if (!course) {
            return createError(400, "Course not found" );
        }

        await prisma.course.delete({
            where:{
             id:course.id
            },
        });
        console.log("This is ID:",id)
        res.json({
            message: "Delete Successfully",
            deleteCourse:course})
    } catch (error) {
        console.log("Error in", error)
        next(error)
    }
}

//done
exports.adminGetEveryCourses = async (req, res, next) => {
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
};