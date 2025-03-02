-- CreateTable
CREATE TABLE `hairstyle` (
    `hairstyleID` INTEGER NOT NULL AUTO_INCREMENT,
    `gender` VARCHAR(191) NOT NULL,
    `face_shape` VARCHAR(191) NOT NULL,
    `age_range` VARCHAR(191) NOT NULL,
    `hairLength` VARCHAR(191) NOT NULL,
    `dresscode` VARCHAR(191) NULL,
    `imageLink` VARCHAR(191) NULL,
    `how_to_achieve` VARCHAR(191) NULL,
    `Products_to_achieve` VARCHAR(191) NULL,

    PRIMARY KEY (`hairstyleID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
