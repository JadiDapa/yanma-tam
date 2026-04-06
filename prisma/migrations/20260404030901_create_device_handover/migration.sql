/*
  Warnings:

  - You are about to drop the column `handoverId` on the `FloorInspection` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Handover` table. All the data in the column will be lost.
  - Added the required column `deviceHandoverId` to the `FloorInspection` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FloorInspection" DROP CONSTRAINT "FloorInspection_handoverId_fkey";

-- DropIndex
DROP INDEX "FloorInspection_handoverId_floorId_key";

-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "handoverTemplate" TEXT;

-- AlterTable
ALTER TABLE "FloorInspection" DROP COLUMN "handoverId",
ADD COLUMN     "deviceHandoverId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Handover" DROP COLUMN "status";

-- DropEnum
DROP TYPE "HandoverStatus";

-- CreateTable
CREATE TABLE "DeviceHandover" (
    "id" SERIAL NOT NULL,
    "handoverId" INTEGER NOT NULL,
    "deviceSlug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceHandover_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DeviceHandover" ADD CONSTRAINT "DeviceHandover_handoverId_fkey" FOREIGN KEY ("handoverId") REFERENCES "Handover"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceHandover" ADD CONSTRAINT "DeviceHandover_deviceSlug_fkey" FOREIGN KEY ("deviceSlug") REFERENCES "Device"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FloorInspection" ADD CONSTRAINT "FloorInspection_deviceHandoverId_fkey" FOREIGN KEY ("deviceHandoverId") REFERENCES "DeviceHandover"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
