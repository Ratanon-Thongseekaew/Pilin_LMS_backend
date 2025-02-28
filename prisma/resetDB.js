require("dotenv").config();
const prisma = require("../src/configs/prisma");
// Beware of the delete order
async function resetDatabase() {
  await prisma.$transaction([
    prisma.user.deleteMany(),
    prisma.category.deleteMany(),
    prisma.course.deleteMany(),
    prisma.cart.deleteMany(),
    prisma.order.deleteMany(),
    prisma.orderItem.deleteMany(),
  ]);

  await prisma.$executeRawUnsafe("Alter Table user auto_increment=1");
}
console.log("Database Resetted");
resetDatabase();


//in terminal use "npm run resetDB"