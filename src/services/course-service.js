const prisma = require("../configs/prisma");


exports.getCoursebyId = (id)=>{
  return  prisma.course.findFirst({
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
}