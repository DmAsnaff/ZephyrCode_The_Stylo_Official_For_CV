/*
  Warnings:

  - You are about to drop the `resettoken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `resettoken` DROP FOREIGN KEY `ResetToken_userId_fkey`;

-- DropTable
DROP TABLE `resettoken`;
