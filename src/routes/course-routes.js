const express = require("express")
const courseRouter = express.Router()
const courseController = require("../controllers/course-controllers")
const { authCheck } = require("../middlewares/auth-middlewares")
//create a new course
courseRouter.post("/admin/courses",authCheck,courseController.adminCreateCourse)
//get all course pagination
courseRouter.get("/admin/courses/:category",courseController.adminGetAllCourses)
// get a course
courseRouter.get("/admin/courses/course/:courseId",authCheck,courseController.adminGetCourse)
//update a course
courseRouter.put("/admin/courses/course/:courseId",authCheck,courseController.adminUpdateCourse)
//delete a course
courseRouter.delete("/admin/courses/course/:courseId",authCheck,courseController.adminDeleteCourse)

// courseRouter.post("/admin/course",courseController.adminCreateCourse)
// courseRouter.get("/allcourses",courseController.adminGetAllCourses)
// courseRouter.get("/course/:id")
// courseRouter.get("admin/course/:id")
// courseRouter.post(admin/course/:id)
// courseRouter.patch(admin/course/:id)
// courseRouter.delete(admin/course/:id)

// ADMIN-COURSE
// |/allcourse|get|y|-|-|-|
// |/course|get|y|:id|-|-|
// |admin/course|post|y|-|:id|{title,description,link,length}
// |admin/course|patch|y|-|:id|{title,description,link,length}
// |admin/course|delete|y|-|:id|

module.exports = courseRouter;