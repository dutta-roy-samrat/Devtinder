/*
  Warnings:

  - The `profile_image_crop_info` column on the `Profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "profile_image_crop_info",
ADD COLUMN     "profile_image_crop_info" JSONB;
