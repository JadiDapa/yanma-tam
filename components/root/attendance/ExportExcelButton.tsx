"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { downloadAttendanceExcel } from "@/app/actions/attendance-list.action";

interface Props {
  attendanceId: number;
  fileName?: string; // e.g. "absen_eos_april_2026"
}

export default function ExportExcelButton({
  attendanceId,
  fileName = "absen_eos",
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const base64 = await downloadAttendanceExcel(attendanceId);

      // Decode base64 → Blob → download
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

      const blob = new Blob([bytes], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      toast.error(err?.message ?? "Gagal mengekspor file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleExport} disabled={loading}>
      {loading ? "Mengekspor..." : "Export Excel"}
    </Button>
  );
}
