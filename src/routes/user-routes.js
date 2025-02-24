const express = require("express");
const userRouters =express.Router();
const userControllers = require("../controllers/user-controllers")
const { authCheck } = require("../middlewares/auth-middlewares")
//user
// get userMe
userRouters.get("/me",authCheck,userControllers.userGetme)
// updateUser
userRouters.put("/me/update",authCheck,userControllers.userUpdate)
// deleteUser
userRouters.delete("/me/delete",authCheck,userControllers.userDelete)
//getcourseList using category
userRouters.get("/courses/:category",authCheck,userControllers.userGetCourseLists)
//get A Course
userRouters.get("/courses/course/:courseId",authCheck,userControllers.userGetCourse)

// userRouters.get("/browse/courses/courseId",authCheck,userControllers.userGetCourse)
//userCart
//userOrder


module.exports = userRouters;