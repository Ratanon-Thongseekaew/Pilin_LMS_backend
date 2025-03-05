const createError = require("../utils/create-errors");
const prisma = require("../configs/prisma");
const cloudinary = require("../configs/cloudinary")
const fs = require("fs")
const path = require("path")
exports.createOrder = async (req, res, next) => {
  const  userId  = req.user.id;
  //transaction = run the sequence
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const cartItems = await prisma.cart.findMany({
        where: { userId },
        include: { course: true },
      });
      if (cartItems.length === 0) {
        return createError(400, "your cart is empty");
      }
      //cal total
      const total = cartItems.reduce((sum, item) => sum + item.course.price, 0);
      // create order item ไปด้วยเลย
      const order = await prisma.order.create({
        data: {
          userId,
          total,
          status: "PENDING",
          orderItem: {
            create: cartItems.map((item) => ({
              courseId: item.courseId,
              price: item.course.price,
            })),
          },
        },
      });
      // delete from cart
      await prisma.cart.deleteMany({
        where: { userId },
      });
      return order;
    });
    res.json({ message: "Create Order Successfully", result: result });
  } catch (error) {
    next(error)
    console.error('Error creating order:', error);
  }
};

exports.uploadPaymentSlip = async(req,res,next)=>{
const {orderId} = req.params;
try {
    const order = await prisma.order.findUnique({
        where:{id:Number(orderId)}
    })
    if(!order){
        return createError(404, "order is not found")
    }
    if(!req.file){
        return createError(400,"no payment is uploaded")
    }
       // File is already saved to disk by multer, get the path
       const filePath = req.file.path;
    
       const result = await cloudinary.uploader.upload(filePath,{
        folder: 'payment-slips',
        public_id: `order-${orderId}-${Date.now()}`,
        resource_type: "auto"
       })
       const updateOrder = await prisma.order.update({
        where: {id:Number(orderId)},
        data: {
          paymentSlip: result.secure_url
        }
       })
       //delete file automaticall after upload to cloudinary
       fs.unlinkSync(filePath)

       res.json({message: "create Payment slip uploaded successfully",
         order:order})
} catch (error) {
    next(error)
    console.error('Error uploading payment slip:', error);
}

}


exports.getUserOrders = async(req,res,next)=>{
const {userId} = req.params;
try {
  //join ตาราง
  const orders = await prisma.order.findMany({
    where:{userId:Number(userId)},
    include: {
      orderItem: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              thumbnails: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  res.json({message: "Get User Order Successfully", orders:orders})
} catch (error) {
  console.error('Error getting user orders:', error);
  next(error)
}
}