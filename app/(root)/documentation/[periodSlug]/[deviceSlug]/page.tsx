import FloorColumn from "@/components/root/documentation/device/floor-list/FloorColumn";
import UploadTemplate from "@/components/root/documentation/device/UploadTemplate";
import PageHeader from "@/components/root/PageHeader";
import { DeviceService } from "@/server/services/device.service";
import { FloorDeviceConfigService } from "@/server/services/floor-device-config.service";
import { FloorService } from "@/server/services/floor.service";
import FloorDescriptionEditor from "@/components/root/documentation/device/FloorDescriptionEditor";
import GenerateDocumentation from "@/components/root/documentation/device/floor-list/GenerateDocumentation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FileText } from "lucide-react";

export default async function DeviceDocumentationPage({
  params,
}: {
  params: Promise<{ deviceSlug: string; periodSlug: string }>;
}) {
  const { deviceSlug, periodSlug } = await params;

  const [floors, device, configs] = await Promise.all([
    FloorService.getFloorDocumentation(deviceSlug, periodSlug),
    DeviceService.getBySlug(deviceSlug),
    FloorDeviceConfigService.getByDevice(deviceSlug),
  ]);

  const descriptionMap = Object.fromEntries(
    configs.map((c) => [
      c.floorSlug,
      { title: c.title, description: c.description },
    ]),
  );

  return (
    <main className="bg-card w-full md:rounded-2xl lg:p-6 p-4 min-h-screen border space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <PageHeader title="Rekapan Dokumentasi YANMA" subtitle="Lorem Ipsum" />

        <div className="flex items-center gap-2">
          {/* Floor Description Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Deskripsi Lantai
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full px-8 sm:max-w-lg overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Deskripsi Per Lantai</SheetTitle>
              </SheetHeader>
              <div className="">
                <FloorDescriptionEditor
                  deviceSlug={deviceSlug}
                  floors={floors.map((f) => ({ slug: f.slug, name: f.name }))}
                  descriptionMap={descriptionMap}
                />
              </div>
            </SheetContent>
          </Sheet>

          <UploadTemplate
            deviceSlug={deviceSlug}
            currentTemplate={device?.template}
          />
          {device?.template && (
            <GenerateDocumentation
              deviceSlug={deviceSlug}
              periodSlug={periodSlug}
              templatePath={device.template}
            />
          )}
        </div>
      </div>

      {/* Floor images */}
      <div className="space-y-8 w-full">
        {floors.map((floor) => (
          <FloorColumn
            key={floor.id}
            floor={floor}
            deviceSlug={deviceSlug}
            periodSlug={periodSlug}
          />
        ))}
      </div>
    </main>
  );
}
