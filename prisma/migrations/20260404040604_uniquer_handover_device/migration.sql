/*
  Warnings:

  - A unique constraint covering the columns `[handoverId,deviceSlug]` on the table `DeviceHandover` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DeviceHandover_handoverId_deviceSlug_key" ON "DeviceHandover"("handoverId", "deviceSlug");
