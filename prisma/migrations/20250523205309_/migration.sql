/*
  Warnings:

  - You are about to drop the column `profile_url` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "profile_url",
ADD COLUMN     "profile_image_crop_info" JSONB,
ADD COLUMN     "profile_image_file" TEXT;
