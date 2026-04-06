-- CreateTable
CREATE TABLE "FloorDeviceConfig" (
    "id" SERIAL NOT NULL,
    "floorSlug" TEXT NOT NULL,
    "deviceSlug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FloorDeviceConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FloorDeviceConfig_floorSlug_deviceSlug_key" ON "FloorDeviceConfig"("floorSlug", "deviceSlug");

-- AddForeignKey
ALTER TABLE "FloorDeviceConfig" ADD CONSTRAINT "FloorDeviceConfig_floorSlug_fkey" FOREIGN KEY ("floorSlug") REFERENCES "Floor"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FloorDeviceConfig" ADD CONSTRAINT "FloorDeviceConfig_deviceSlug_fkey" FOREIGN KEY ("deviceSlug") REFERENCES "Device"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
