/*
  Warnings:

  - You are about to drop the column `contentId` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `course` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(1))`.
  - You are about to drop the column `firstName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `content` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,courseId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoURL` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `course` DROP FOREIGN KEY `Course_contentId_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_orderId_fkey`;

-- DropIndex
DROP INDEX `Course_contentId_fkey` ON `course`;

-- AlterTable
ALTER TABLE `cart` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `category` MODIFY `name` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `course` DROP COLUMN `contentId`,
    DROP COLUMN `status`,
    ADD COLUMN `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `thumbnails` LONGTEXT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `videoURL` VARCHAR(191) NOT NULL,
    MODIFY `title` VARCHAR(100) NOT NULL,
    MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `paymentSlip` VARCHAR(191) NULL,
    ADD COLUMN `total` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `user` DROP COLUMN `firstName`,
    DROP COLUMN `lastName`,
    ADD COLUMN `firstname` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastname` VARCHAR(191) NOT NULL,
    ADD COLUMN `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `content`;

-- DropTable
DROP TABLE `payment`;

-- CreateIndex
CREATE UNIQUE INDEX `Cart_userId_courseId_key` ON `Cart`(`userId`, `courseId`);
