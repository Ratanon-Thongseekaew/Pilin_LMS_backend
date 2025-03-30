const createError = require("../utils/create-errors");
const prisma = require("../configs/prisma");
const cloudinary = require("../configs/cloudinary");
const fs = require("fs");
const path = require("path");
const { title } = require("process");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createOrder = async (req, res, next) => {
  const userId = req.user.id;
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
    next(error);
    console.error("Error creating order:", error);
  }
};

exports.uploadPaymentSlip = async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
    });
    if (!order) {
      return createError(404, "order is not found");
    }
    if (!req.file) {
      return createError(400, "no payment is uploaded");
    }
    // File is already saved to disk by multer, get the path
    const filePath = req.file.path;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "payment-slips",
      public_id: `order-${orderId}-${Date.now()}`,
      resource_type: "auto",
    });
    const updateOrder = await prisma.order.update({
      where: { id: Number(orderId) },
      data: {
        paymentSlip: result.secure_url,
      },
    });
    //delete file automaticall after upload to cloudinary
    fs.unlinkSync(filePath);

    res.json({
      message: "create Payment slip uploaded successfully",
      order: order,
    });
  } catch (error) {
    next(error);
    console.error("Error uploading payment slip:", error);
  }
};

exports.getUserOrders = async (req, res, next) => {
  const { userId } = req.params;
  try {
    //join ตาราง
    const orders = await prisma.order.findMany({
      where: { userId: Number(userId) },
      include: {
        orderItem: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                thumbnails: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json({ message: "Get User Order Successfully", orders: orders });
  } catch (error) {
    console.error("Error getting user orders:", error);
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    // Optional: Get status filter from query params
    const { status } = req.query;

    // Build filter conditions
    const where = {};
    if (status && ["PENDING", "SUCCESS", "FAILED"].includes(status)) {
      where.status = status;
    }

    // Get all orders with user and order item information
    const orders = await prisma.order.findMany({
      where,
      include: {
        users: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
        orderItem: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ message: "Get All Orders Successfully", orders: orders });
  } catch (error) {
    console.error("Error getting all orders:", error);
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    // Validate status
    if (!["PENDING", "SUCCESS", "FAILED"].includes(status)) {
      return createError(400, "Invalid status value");
    }

    // Find the order first to check if it exists
    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
    });

    if (!order) {
      return createError(404, "Order not found");
    }

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status },
      include: {
        users: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });

    res.json({
      message: `Order status updated to ${status} successfully`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    next(error);
  }
};

exports.checkOut = async (req, res, next) => {
  try {
    const id = req.params.id;
    //find order
    if (!id) {
      return res.status(400).json({ error: "Missing order ID" });
    }
    const numericId = id.toString().replace(/[^0-9]/g, '');
    if (!numericId) {
      return res.status(400).json({ error: "No valid digits found in order ID" });
    }
    const orderId = parseInt(numericId, 10); // 10 ==> redis to interpret the string id as a decimal (base 10) number.
    if (!/^\d+$/.test(id.trim())) {
      return res.status(400).json({ error: "Order ID must contain only digits" });
    }
    console.log("Looking for order with ID:", orderId);

    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include: {
        orderItem: {
          include: {
            course: {
              select: {
                title: true,
                description: true,
                price: true,
                thumbnails: true,
              },
            },
          },
        },
      },
    });
    console.log("Order found:", order ? "Yes" : "No");

    if (!order) {
      return createError(404, "order is not found");
    }
    console.log("Order total:", order.total);

    //stripe
    const line_items = order.orderItem.map((item) => ({
      quantity: 1,
      price_data: {
        currency: "thb",
        product_data: {
          name: item.course.title,
          description: item.course.description,
          images: item.course.thumbnails ? [item.course.thumbnails] : [],
        },
        unit_amount: item.course.price * 100,
      },
    }));

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      metadata: {orderId:order.id},
      line_items: line_items,
      mode: "payment",
      return_url: `http://localhost:5173/user/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
    });
    res.send({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Checkout error:", error);
    next(error);
  }
};

exports.checkOutStatus = async (req, res, next) => {
  try {
    // Get from path parameter, not query parameter
    const session_id = req.params.session_id;
    
    console.log("Request params:", req.params);
    console.log("Session ID from path:", session_id);
    
    if (!session_id) {
      return res.status(400).json({ error: "Missing session ID" });
    }
    
    try {
      console.log("Retrieving Stripe session:", session_id);
      const session = await stripe.checkout.sessions.retrieve(session_id);
      console.log("Stripe session retrieved successfully:", session.id);
      
      const orderId = session.metadata?.orderId;
      console.log("Order ID from session metadata:", orderId);
      
      if (!orderId) {
        return res.status(400).json({ error: "No order ID found in session metadata" });
      }
      
      if (session.status !== "complete") {
        return res.status(400).json({ error: "Payment not complete", status: session.status });
      }
      
      console.log("Updating order status for order ID:", orderId);
      const result = await prisma.order.update({
        where: {
          id: Number(orderId)
        },
        data: {
          status: "SUCCESS"
        }
      });
      
      console.log("Order status updated successfully");
      
      res.json({ 
        message: "Payment Complete", 
        status: session.status,
        order: {
          id: result.id,
          status: result.status
        }
      });
    } catch (stripeError) {
      console.error("Stripe API error:", stripeError.message);
      return res.status(400).json({ error: `Stripe error: ${stripeError.message}` });
    }
  } catch (error) {
    console.error("Session retrieval error:", error);
    next(error);
  }
};
