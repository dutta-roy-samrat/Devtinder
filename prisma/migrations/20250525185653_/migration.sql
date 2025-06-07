/*
  Warnings:

  - You are about to drop the column `profile_image_file` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "profile_image_file",
ADD COLUMN     "original_profile_image_url" TEXT;
