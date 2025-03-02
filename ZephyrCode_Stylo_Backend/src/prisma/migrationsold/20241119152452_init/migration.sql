-- CreateTable
CREATE TABLE `FaceImage` (
    `ImageID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `FrontImage` VARCHAR(191) NOT NULL,
    `SideImage` VARCHAR(191) NOT NULL,
    `UploadTime` DATETIME(3) NOT NULL,
    `UploadDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`ImageID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserPreference` (
    `SelectionID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `HairstyleID` INTEGER NOT NULL,

    PRIMARY KEY (`SelectionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WholeHairstyleCollection` (
    `HairstyleID` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`HairstyleID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerbalExplanation_Product` (
    `ExplanationID` INTEGER NOT NULL,
    `ProductID` INTEGER NOT NULL,
    `HairstyleID` INTEGER NOT NULL,
    `Explanation` VARCHAR(191) NOT NULL,
    `Product` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ExplanationID`, `ProductID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HairstyleTryOn` (
    `TryOnID` INTEGER NOT NULL AUTO_INCREMENT,
    `TryOnImage` VARCHAR(191) NOT NULL,
    `SelectionID` INTEGER NOT NULL,

    PRIMARY KEY (`TryOnID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SocialForumPost` (
    `PostID` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `PostContent` VARCHAR(191) NOT NULL,
    `ThumbsUp` INTEGER NOT NULL,
    `ThumbsDown` INTEGER NOT NULL,

    PRIMARY KEY (`PostID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FaceImage` ADD CONSTRAINT `FaceImage_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPreference` ADD CONSTRAINT `UserPreference_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPreference` ADD CONSTRAINT `UserPreference_HairstyleID_fkey` FOREIGN KEY (`HairstyleID`) REFERENCES `WholeHairstyleCollection`(`HairstyleID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VerbalExplanation_Product` ADD CONSTRAINT `VerbalExplanation_Product_HairstyleID_fkey` FOREIGN KEY (`HairstyleID`) REFERENCES `WholeHairstyleCollection`(`HairstyleID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HairstyleTryOn` ADD CONSTRAINT `HairstyleTryOn_SelectionID_fkey` FOREIGN KEY (`SelectionID`) REFERENCES `UserPreference`(`SelectionID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SocialForumPost` ADD CONSTRAINT `SocialForumPost_email_fkey` FOREIGN KEY (`email`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
