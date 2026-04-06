"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  CreateAttendanceListSchema,
  UpdateAttendanceListSchema,
} from "@/server/validators/attendance-list.validator";
import { AttendanceListService } from "@/server/services/attendance-list.service";
import { CreateAttendanceEntryDTO } from "@/server/validators/attendance-entry.validator";
import ExcelJS from "exceljs";

export async function createAttendanceList(
  input: {
    eosId: string;
    supervisorId: string;
    startDate: string;
    endDate: string;
  },
  rows: Omit<CreateAttendanceEntryDTO, "attendanceListId">[],
) {
  const dateObj = new Date(input.startDate);

  const data = CreateAttendanceListSchema.parse({
    eosId: Number(input.eosId),
    supervisorId: Number(input.supervisorId),
    month: dateObj.getMonth() + 1,
    year: dateObj.getFullYear(),
    startDate: input.startDate,
    endDate: input.endDate,
    status: "DRAFT",
  });

  const entries = rows.map((row) => ({
    date: new Date(row.date),
    checkIn: row.checkIn,
    checkOut: row.checkOut,
  }));

  try {
    await AttendanceListService.create({ ...data, entries });
  } catch (error) {
    console.error("Action Error:", error);
    throw new Error("Failed to create attendance report");
  }

  revalidatePath("/attendance");
  redirect("/attendance");
}

export async function updateAttendanceListFull(
  id: number,
  input: {
    eosId: string;
    supervisorId: string;
    startDate: string;
    endDate: string;
  },
  rows: { date: Date; checkIn: string; checkOut: string }[],
) {
  const dateObj = new Date(input.startDate);

  const data = UpdateAttendanceListSchema.parse({
    eosId: Number(input.eosId),
    supervisorId: Number(input.supervisorId),
    month: dateObj.getMonth() + 1,
    year: dateObj.getFullYear(),
    startDate: input.startDate,
    endDate: input.endDate,
  });

  const entries = rows.map((row) => ({
    date: new Date(row.date),
    checkIn: row.checkIn,
    checkOut: row.checkOut,
  }));

  try {
    await AttendanceListService.updateFull(id, { ...data, entries });
  } catch (error) {
    console.error("Action Error:", error);
    throw new Error("Failed to update attendance report");
  }

  revalidatePath("/attendance/" + id);
  revalidatePath("/attendance");
}

export async function deleteAttendance(id: number) {
  await AttendanceListService.delete(id);

  revalidatePath("/attendance");
}

interface AttendanceEntry {
  date: string | Date;
  checkIn: string;
  checkOut: string;
}

interface AttendanceData {
  month: number;
  year: number;
  startDate: string | Date;
  endDate: string | Date;
  entries: AttendanceEntry[];
  eos: { name: string; nip?: string };
  supervisor: { name: string; nip: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTH_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function toDate(d: string | Date): Date {
  return d instanceof Date ? d : new Date(d);
}

// Normalize UTC-stored dates (stored as previous day 17:00 WIB) to the correct local date
function normalizeDate(d: string | Date): Date {
  const raw = toDate(d);
  // If time is 17:00 UTC → that's midnight+1h WIB (UTC+7), advance by 1 day
  if (raw.getUTCHours() === 17) {
    return new Date(
      Date.UTC(raw.getUTCFullYear(), raw.getUTCMonth(), raw.getUTCDate() + 1),
    );
  }
  return raw;
}

// ─── Style helpers ────────────────────────────────────────────────────────────

function applyThinBorder(cell: ExcelJS.Cell) {
  const thin: ExcelJS.BorderStyle = "thin";
  cell.border = {
    top: { style: thin },
    left: { style: thin },
    bottom: { style: thin },
    right: { style: thin },
  };
}

function centerAlign(cell: ExcelJS.Cell) {
  cell.alignment = { horizontal: "center", vertical: "middle" };
}

export async function exportAttendanceToExcel(
  attendance: AttendanceData,
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  const sheetName = `${MONTH_ID[attendance.month - 1]} ${attendance.year}`;
  const ws = wb.addWorksheet(sheetName);

  // ── Column widths (matching template) ──────────────────────────────────────
  ws.columns = [
    { key: "A", width: 5 }, // A: NO
    { key: "B", width: 15 }, // B: HARI
    { key: "C", width: 11 }, // C: TANGGAL
    { key: "D", width: 2.5 }, // D: (separator)
    { key: "E", width: 10 }, // E: MASUK
    { key: "F", width: 13 }, // F: KELUAR
    { key: "G", width: 9.5 }, // G: (spacer)
    { key: "H", width: 24.5 }, // H: Mengetahui / TTD
  ];

  // ── Header rows 1–6 ────────────────────────────────────────────────────────
  const headers = [
    "KEPOLISIAN NEGARA REPUBLIK INDONESIA",
    "DAERAH SUMATERA SELATAN",
    "PELAYANAN MARKAS",
    "ABSENSI ENGINEER ON SITE",
    "PELAYANAN MARKAS POLDA SUMSEL",
  ];
  const headerMerges: [string, string][] = [
    ["A1", "E1"],
    ["A2", "E2"],
    ["A3", "E3"],
    ["A4", "D4"],
    ["A5", "F5"],
    ["A6", "F6"],
  ];

  headers.forEach((text, i) => {
    const row = i + 1;
    const cell = ws.getCell(`A${row}`);
    cell.value = text;
    cell.alignment = { horizontal: "center", vertical: "middle" };
    ws.mergeCells(headerMerges[i]![0], headerMerges[i]![1]);
    if (row >= 5) {
      cell.font = { name: "Arial", bold: true, size: 12 };
    } else {
      cell.font = { name: "Arial", size: 11 };
    }
    ws.getRow(row).height = 16;
  });

  // ── Row 7: blank ───────────────────────────────────────────────────────────
  ws.getRow(7).height = 16.5;

  // ── Row 8: NAMA ────────────────────────────────────────────────────────────
  ws.getRow(8).height = 17.25;
  ws.mergeCells("A8", "B8");
  ws.getCell("A8").value = "NAMA";
  ws.getCell("A8").font = { name: "Arial", size: 11 };
  ws.getCell("C8").value = attendance.eos.name.toUpperCase();
  ws.getCell("C8").font = { name: "Arial", size: 11 };

  // ── Row 9: PERIODE ─────────────────────────────────────────────────────────
  ws.getRow(9).height = 17.25;
  ws.mergeCells("A9", "B9");
  ws.getCell("A9").value = "PERIODE";
  ws.getCell("A9").font = { name: "Arial", size: 11 };
  const start = toDate(attendance.startDate);
  const end = toDate(attendance.endDate);
  ws.getCell("C9").value = start;
  ws.getCell("C9").numFmt = "DD MMMM YYYY";
  ws.getCell("C9").font = { name: "Arial", size: 11 };
  ws.getCell("D9").value = "-";
  ws.getCell("D9").alignment = { horizontal: "center" };
  ws.mergeCells("E9", "F9");
  ws.getCell("E9").value = end;
  ws.getCell("E9").numFmt = "DD MMMM YYYY";
  ws.getCell("E9").font = { name: "Arial", size: 11 };

  // ── Row 10: blank ──────────────────────────────────────────────────────────
  ws.getRow(10).height = 16.5;

  // ── Row 11: Table header ───────────────────────────────────────────────────
  ws.getRow(11).height = 16.5;
  const headerRow = ws.getRow(11);
  const tableHeaders: { col: string; val: string }[] = [
    { col: "A", val: "NO" },
    { col: "B", val: "HARI" },
    { col: "C", val: "TANGGAL" },
    { col: "E", val: "MASUK" },
    { col: "F", val: "KELUAR" },
    { col: "H", val: "Mengetahui," },
  ];
  tableHeaders.forEach(({ col, val }) => {
    const cell = ws.getCell(`${col}11`);
    cell.value = val;
    cell.font = {
      name: "Arial",
      bold: col !== "H",
      size: col === "H" ? 12 : 11,
    };
    if (col !== "H") {
      centerAlign(cell);
      applyThinBorder(cell);
    }
  });

  // ── Data rows (start at row 12) ────────────────────────────────────────────
  // Sort entries by date ascending
  const sorted = [...attendance.entries].sort(
    (a, b) => normalizeDate(a.date).getTime() - normalizeDate(b.date).getTime(),
  );

  const DAY_ID = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const pad = (n: number) => String(n).padStart(2, "0");

  let excelRow = 12; // Current Excel row
  let dataIndex = 0; // 0-based index within current batch of 5

  sorted.forEach((entry, i) => {
    const date = normalizeDate(entry.date);
    const batchPos = i % 5; // 0..4 within each group of 5

    ws.getRow(excelRow).height = 16.5;

    // NO
    const cellNo = ws.getCell(`A${excelRow}`);
    cellNo.value = i + 1;
    cellNo.font = { name: "Arial", size: 11 };
    centerAlign(cellNo);
    applyThinBorder(cellNo);

    // HARI (use formula to display day name in Indonesian... Excel TEXT with DDDD gives English)
    // We write the value directly in Indonesian instead
    const cellDay = ws.getCell(`B${excelRow}`);
    cellDay.value = DAY_ID[date.getDay()];
    cellDay.font = { name: "Arial", size: 11 };
    centerAlign(cellDay);
    applyThinBorder(cellDay);

    // TANGGAL
    const cellDate = ws.getCell(`C${excelRow}`);
    cellDate.value = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
    cellDate.font = { name: "Arial", size: 11 };
    centerAlign(cellDate);
    applyThinBorder(cellDate);

    // MASUK
    const cellIn = ws.getCell(`E${excelRow}`);
    cellIn.value = entry.checkIn ?? "";
    cellIn.font = { name: "Arial", size: 11 };
    centerAlign(cellIn);
    applyThinBorder(cellIn);

    // KELUAR
    const cellOut = ws.getCell(`F${excelRow}`);
    cellOut.value = entry.checkOut ?? "";
    cellOut.font = { name: "Arial", size: 11 };
    centerAlign(cellOut);
    applyThinBorder(cellOut);

    // Signature: on every 5th row in a batch, add supervisor name in col H
    if (batchPos === 4) {
      // First entry in group (batchPos 0) gets "Pengawas Gd.Presisi" label
      // which is actually placed at the START of the group (excelRow - 4)
      const labelRow = excelRow - 4;
      const labelCell = ws.getCell(`H${labelRow}`);
      if (i < 5) {
        // Only on the very first group the label appears
        labelCell.value = "Pengawas Gd.Presisi";
        labelCell.font = { name: "Arial", size: 12 };
      }
      // Supervisor name on 5th row
      const sigCell = ws.getCell(`H${excelRow}`);
      sigCell.value = attendance.supervisor.name;
      sigCell.font = { name: "Arial", bold: true, size: 12 };

      excelRow++; // extra row for NRP
      ws.getRow(excelRow).height = 16.5;
      const nrpCell = ws.getCell(`H${excelRow}`);
      nrpCell.value = `NRP. ${attendance.supervisor.nip}`;
      nrpCell.font = { name: "Arial", size: 12 };
    }

    excelRow++;
  });

  // If remaining entries don't complete a batch of 5, still add final signature
  const remainder = sorted.length % 5;
  if (remainder !== 0) {
    const sigRow = excelRow - 1; // last written data row
    const groupStart = sigRow - remainder + 1;

    // Add label at start of group if it's the first group
    if (sorted.length <= 5) {
      const labelCell = ws.getCell(`H${groupStart}`);
      labelCell.value = "Pengawas Gd.Presisi";
      labelCell.font = { name: "Arial", size: 12 };
    }

    // Supervisor name at last data row
    const sigCell = ws.getCell(`H${sigRow}`);
    sigCell.value = attendance.supervisor.name;
    sigCell.font = { name: "Arial", bold: true, size: 12 };

    ws.getRow(excelRow).height = 16.5;
    const nrpCell = ws.getCell(`H${excelRow}`);
    nrpCell.value = `NRP. ${attendance.supervisor.nip}`;
    nrpCell.font = { name: "Arial", size: 12 };
  }

  // ── Serialize to Buffer ────────────────────────────────────────────────────
  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

export async function downloadAttendanceExcel(id: number): Promise<string> {
  const attendance = await AttendanceListService.getById(id);
  if (!attendance) throw new Error("Attendance not found");

  const buffer = await exportAttendanceToExcel(attendance);

  // Return as base64 so the client can trigger a download
  return buffer.toString("base64");
}
