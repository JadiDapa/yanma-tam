import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import {
  buildDocumentationData,
  generateDocumentationDocument,
} from "@/lib/generate-documentation";
import { FloorService } from "@/server/services/floor.service";
import { FloorDeviceConfigService } from "@/server/services/floor-device-config.service";

export async function POST(req: NextRequest) {
  const { deviceSlug, periodSlug, templatePath } = await req.json();

  const relativeTemplate = templatePath.startsWith("/")
    ? templatePath.slice(1)
    : templatePath;
  const absoluteTemplatePath = join(process.cwd(), "public", relativeTemplate);

  const [floors, configs] = await Promise.all([
    FloorService.getFloorDocumentation(deviceSlug, periodSlug),
    FloorDeviceConfigService.getByDevice(deviceSlug),
  ]);

  const data = buildDocumentationData(floors, configs);

  const buffer = await generateDocumentationDocument(
    absoluteTemplatePath,
    data,
    join(process.cwd(), "public"),
  );

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="dokumentasi-${deviceSlug}-${periodSlug}.docx"`,
    },
  });
}
