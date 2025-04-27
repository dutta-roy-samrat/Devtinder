/*
  Warnings:

  - A unique constraint covering the columns `[requester_id,receiver_id]` on the table `Connections` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Connections_requester_id_receiver_id_key" ON "Connections"("requester_id", "receiver_id");
