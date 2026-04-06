import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import ImageModule from "docxtemplater-image-module-free";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import sizeOf from "image-size";

interface ImageRow {
  leftFileUrl: string | null;
  rightFileUrl: string | null;
}

interface FloorData {
  floorTitle: string;
  description: string;
  imageRows: ImageRow[];
}

interface DocumentationTemplateData {
  floors: FloorData[];
}

export function buildDocumentationData(
  floors: Array<{
    slug: string;
    name: string;
    documentation: Array<{
      images: Array<{ fileUrl: string }>;
    }>;
  }>,
  configs: Array<{ floorSlug: string; title: string; description: string }>,
): { floors: FloorData[] } {
  const configMap = Object.fromEntries(configs.map((c) => [c.floorSlug, c]));

  const floorList: FloorData[] = floors.map((floor) => {
    const config = configMap[floor.slug];
    const images = floor.documentation.flatMap((doc) =>
      doc.images.map((img) => ({ fileUrl: img.fileUrl })),
    );

    const imageRows = [];
    for (let i = 0; i < images.length; i += 2) {
      imageRows.push({
        leftFileUrl: images[i]?.fileUrl ?? null,
        rightFileUrl: images[i + 1]?.fileUrl ?? null,
      });
    }

    return {
      floorTitle: config?.title ?? floor.name.toUpperCase(),
      description: config?.description ?? "",
      imageRows,
    };
  });

  return { floors: floorList };
}

const TRANSPARENT_PNG_1x1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7W1xkAAAAASUVORK5CYII=",
  "base64",
);

export async function generateDocumentationDocument(
  templatePath: string,
  data: DocumentationTemplateData,
  basePublicPath: string,
): Promise<Buffer> {
  // Pre-fetch all images first
  const allUrls = new Set<string>();
  for (const floor of data.floors) {
    for (const row of floor.imageRows) {
      if (row.leftFileUrl) allUrls.add(row.leftFileUrl);
      if (row.rightFileUrl) allUrls.add(row.rightFileUrl);
    }
  }
  const imageCache = new Map<string, Buffer>();
  await Promise.all(
    [...allUrls].map(async (value) => {
      try {
        let buf: Buffer;
        if (/^https?:\/\//i.test(value)) {
          const res = await fetch(value);
          buf = res.ok
            ? Buffer.from(await res.arrayBuffer())
            : TRANSPARENT_PNG_1x1;
        } else {
          const relative = value
            .replace(/^\/api\//, "") // add this line
            .replace(/^\//, "");
          const fullPath = join(basePublicPath, relative);
          buf = existsSync(fullPath)
            ? readFileSync(fullPath)
            : TRANSPARENT_PNG_1x1;
        }
        imageCache.set(value, buf);
        console.log("[prefetch] cached:", value, "size:", buf.length);
      } catch {
        imageCache.set(value, TRANSPARENT_PNG_1x1);
      }
    }),
  );

  const content = readFileSync(templatePath, "binary");
  const zip = new PizZip(content);

  const imageModule = new ImageModule({
    centered: false,
    fileType: "docx",
    getImage(tagValue: any): Buffer {
      console.log("[getImage] tagValue:", tagValue, "type:", typeof tagValue);
      if (!tagValue) return TRANSPARENT_PNG_1x1;
      const value = String(tagValue).trim();
      const cached = imageCache.get(value);
      console.log("[getImage] cache hit:", !!cached, "for:", value);
      return cached ?? TRANSPARENT_PNG_1x1;
    },
    getSize(img: Buffer): [number, number] {
      if (!img || img.length <= 4) return [300, 225];
      try {
        const d = sizeOf(img);
        if (!d?.width || !d?.height) return [300, 225];
        return [300, Math.round(300 * (d.height / d.width))];
      } catch {
        return [300, 225];
      }
    },
  });

  const doc = new Docxtemplater(zip, {
    modules: [imageModule],
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.render(data); // SYNC — not renderAsync
  return doc.getZip().generate({ type: "nodebuffer", compression: "DEFLATE" });
}
