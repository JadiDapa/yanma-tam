// lib/docx/handoverTemplate.ts
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";

export type FloorInspection = {
  date: Date;
  timeStart: string;
  timeEnd: string;
  supervisorName: string;
  floor: { name: string };
};

export type HandoverTemplateInput = {
  templatePath: string; // absolute path to the .docx template file
  floorInspections: FloorInspection[];
  month: number;
  year: number;
};

// Maps floor display names to the prefix used in the .docx template tags
// e.g. "Basement" → tags like {floor_basement_date}, {floor_basement_supervisor}
function floorNameToPrefix(name: string): string {
  const map: Record<string, string> = {
    Basement: "basement",
    "Floor 1": "floor_1",
    "Floor 2": "floor_2",
    "Floor 3": "floor_3",
    "Floor 4": "floor_4",
    "Floor 5": "floor_5",
    "Floor 6": "floor_6",
    "Floor 7": "floor_7",
  };
  return map[name] ?? name.toLowerCase().replace(/\s+/g, "_");
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function renderHandoverDocx(input: HandoverTemplateInput): Buffer {
  const absolutePath = path.join(process.cwd(), "public", input.templatePath);
  const templateBuffer = fs.readFileSync(absolutePath);

  // Build the flat tag map — one entry per floor per field
  const data: Record<string, string> = {
    month: String(input.month),
    year: String(input.year),
  };

  for (const inspection of input.floorInspections) {
    const prefix = floorNameToPrefix(inspection.floor.name);
    data[`${prefix}_date`] = formatDate(inspection.date);
    data[`${prefix}_time_start`] = inspection.timeStart;
    data[`${prefix}_time_end`] = inspection.timeEnd;
    data[`${prefix}_supervisor`] = inspection.supervisorName;
  }

  const zip = new PizZip(templateBuffer);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    // Prevent errors on missing tags — renders empty string instead of throwing
    nullGetter: () => "",
  });

  doc.render(data);

  return doc.getZip().generate({ type: "nodebuffer" }) as Buffer;
}
