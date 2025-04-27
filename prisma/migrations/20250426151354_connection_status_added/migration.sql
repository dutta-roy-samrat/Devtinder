-- CreateEnum
CREATE TYPE "ConnectionStatus" AS ENUM ('ACCEPTED', 'REJECTED', 'PENDING');

-- AlterTable
ALTER TABLE "Connections" ADD COLUMN     "status" "ConnectionStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "Connections_requester_id_idx" ON "Connections"("requester_id");

-- CreateIndex
CREATE INDEX "Connections_receiver_id_idx" ON "Connections"("receiver_id");
