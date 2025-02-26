const express = require("express")
const courseRouter = express.Router()
const courseController = require("../controllers/course-controllers")
const { authCheck } = require("../middlewares/auth-middlewares")
//create a new course
courseRouter.post("/admin/courses",authCheck,courseController.adminCreateCourse)
//get every courses
courseRouter.get("/admin/courses/course/allcourses",authCheck,courseController.adminGetEveryCourses)
//get all course pagination with category
courseRouter.get("/admin/courses/:category",authCheck,courseController.adminGetAllCourses)
// get a course
courseRouter.get("/admin/courses/course/:courseId",authCheck,courseController.adminGetCourse)
//update a course
courseRouter.put("/admin/courses/course/:courseId",authCheck,courseController.adminUpdateCourse)
//delete a course
courseRouter.delete("/admin/courses/course/:courseId",authCheck,courseController.adminDeleteCourse)

module.exports = courseRouter;