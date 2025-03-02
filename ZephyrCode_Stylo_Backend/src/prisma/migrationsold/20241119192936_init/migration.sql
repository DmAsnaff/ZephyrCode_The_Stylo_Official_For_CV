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
ALTER TABLE `SocialForumPost` ADD CONSTRAINT `SocialForumPost_email_fkey` FOREIGN KEY (`email`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
