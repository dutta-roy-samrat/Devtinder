-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "profile_url" SET DEFAULT '';

-- CreateIndex
CREATE INDEX "User_created_at_id_idx" ON "User"("created_at", "id");
