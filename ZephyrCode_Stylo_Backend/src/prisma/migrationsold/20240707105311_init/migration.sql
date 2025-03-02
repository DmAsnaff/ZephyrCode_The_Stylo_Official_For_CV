/*
  Warnings:

  - Made the column `dresscode` on table `hairstyle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageLink` on table `hairstyle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `how_to_achieve` on table `hairstyle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Products_to_achieve` on table `hairstyle` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `hairstyle` MODIFY `dresscode` VARCHAR(191) NOT NULL,
    MODIFY `imageLink` VARCHAR(191) NOT NULL,
    MODIFY `how_to_achieve` VARCHAR(191) NOT NULL,
    MODIFY `Products_to_achieve` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `UserHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `front_image_link` VARCHAR(191) NULL,
    `side_image_link` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NOT NULL,
    `faceshape` VARCHAR(191) NOT NULL,
    `hairstyle_transferred_image_link` VARCHAR(191) NULL,
    `actionDate` DATETIME(3) NOT NULL,
    `actionTime` DATETIME(3) NOT NULL,
    `agerange` VARCHAR(191) NOT NULL,
    `dresscode` VARCHAR(191) NOT NULL,
    `hairlength` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserHistory` ADD CONSTRAINT `UserHistory_email_fkey` FOREIGN KEY (`email`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
