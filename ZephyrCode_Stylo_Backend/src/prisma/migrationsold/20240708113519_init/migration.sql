/*
  Warnings:

  - You are about to drop the column `actionDate` on the `userhistory` table. All the data in the column will be lost.
  - You are about to drop the column `actionTime` on the `userhistory` table. All the data in the column will be lost.
  - Added the required column `actionDateTime` to the `UserHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `userhistory` DROP COLUMN `actionDate`,
    DROP COLUMN `actionTime`,
    ADD COLUMN `actionDateTime` DATETIME(3) NOT NULL;
