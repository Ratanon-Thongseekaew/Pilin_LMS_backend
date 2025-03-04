const createError = require("../utils/create-errors");
const prisma = require("../configs/prisma");
const cloudinary = require("../configs/cloudinary")

exports.createOrder = async (req, res, next) => {
  const { userId } = req.body;
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
    const fileExt = path.extname(req.file.originalname);
    const publicId = `payment_${Date.now()}${Math.round(Math.random()*100)}`;

    //upload pic
    
} catch (error) {
    
}

}
