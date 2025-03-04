const createError =require("../utils/create-errors");
const prisma = require("../configs/prisma");

//done
exports.addtoCart = async (req, res, next) => {
  const {  courseId } = req.body;
  const userId = req.user.id
  try {
    const existingCartItem = await prisma.cart.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
    if (existingCartItem) {
      createError(409, "Course is already in cart");
    }
    const cartItem = await prisma.cart.create({
      data: {
        userId,
        courseId,
      },
    });
    res.json({ message: "Add to cart Successfully", cartItem: cartItem });
  } catch (error) {
    next(error);
  }
};

//doing
exports.getAllCartItems = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cartItem = await prisma.cart.findMany({
      where: { userId },
      include: { course: true },
    });
    res.json({ message: "Hello, get cart item", cartItem: cartItem });
  } catch (error) {
    next(error);
  }
};

exports.removefromCart = async (req, res, next) => {
  try {
    const userId = +req.user.id;
    const {courseId} = +req.params;

    const cartItem = await prisma.cart.findFirst({
        where: {userId,courseId:courseId},
    });
    if(!cartItem){
        return createError(404,"Course is not found")
    }
    await prisma.cart.delete({
        where:{
            id:cartItem.id
        }
    })
    console.log(cartItem )
    res.json({ message: "Course was remove from Cart" });
  } catch (error) {
    next(error);
  }
};
exports.clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cartItem = await prisma.cart.deleteMany({
      where: {userId},
    })
    res.json({ message: "Clear Cart Succesfully", cartItem :cartItem  });
  } catch (error) {
    next(error);
  }
};
