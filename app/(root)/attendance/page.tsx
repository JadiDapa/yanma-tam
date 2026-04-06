import Link from "next/link";
import PageHeader from "@/components/root/PageHeader";
import { Plus } from "lucide-react";
import { AttendanceListType } from "@/server/validators/attendance-list.validator";
import { AttendanceStatus } from "@/generated/prisma";
import { AttendanceListService } from "@/server/services/attendance-list.service";

const MONTH_NAMES = [
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

function groupByMonthYear(lists: AttendanceListType[]) {
  const map = new Map<string, AttendanceListType[]>();
  for (const list of lists) {
    const key = `${list.year}-${list.month}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(list);
  }
  return map;
}

function filledEntries(list: AttendanceListType) {
  return list.entries.filter((e) => e.checkIn && e.checkOut).length;
}

function StatusBadge({ status }: { status: AttendanceStatus }) {
  const isDraft = status === "DRAFT";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold tracking-widest uppercase ${
        isDraft
          ? "bg-amber-50 text-amber-700 border border-amber-200"
          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isDraft ? "bg-amber-500" : "bg-emerald-500"
        }`}
      />
      {isDraft ? "Draft" : "Finalisasi"}
    </span>
  );
}

function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-slate-400 tabular-nums w-16 text-right">
        {value}/{total} hari
      </span>
    </div>
  );
}

function AttendanceRow({ list }: { list: AttendanceListType }) {
  const filled = filledEntries(list);
  const total = list.entries.length;

  return (
    <div className="group relative flex items-center gap-4 px-5 py-4 hover:brightness-90 transition-colors border-b border-slate-400 last:border-0">
      {/* left accent */}
      <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-transparent group-hover:bg-primary transition-colors rounded-full" />

      {/* user initial */}
      <div className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
        {list.eos?.name.charAt(0)}
      </div>

      {/* main info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">
          {list.eos?.name}
        </p>
        <p className="text-xs text-slate-400 mt-0.5 font-mono">
          NIP {list.eos?.nip}
        </p>
        <div className="mt-2">
          <ProgressBar value={filled} total={total} />
        </div>
      </div>

      {/* status + actions */}
      <div className="flex items-center gap-3 shrink-0">
        <StatusBadge status={list.status} />
        <Link
          href={`/attendance/${list.id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold text-primary border border-primary hover:bg-primary hover:text-white hover:border-primary transition-all"
        >
          Lihat
          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default async function AttendancePage() {
  const attendanceList = await AttendanceListService.getGroupedByMonthYear();
  const grouped = groupByMonthYear(attendanceList);
  const sortedKeys = Array.from(grouped.keys()).sort((a, b) =>
    b.localeCompare(a),
  );

  console.log(attendanceList);

  return (
    <main className="bg-card w-full md:rounded-2xl lg:p-6 p-4 min-h-screen border space-y-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <PageHeader
          title={`Rekapan Absensi Engineer On Site`}
          subtitle="Pelayanan Markas — semua laporan dikelompokkan per bulan"
        />
        <Link
          href="/attendance/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg  text-sm font-semibold hover:bg-primary active:scale-95 transition-all shadow-sm"
        >
          <Plus />
          Buat Laporan
        </Link>
      </div>

      {/* Monthly groups */}
      <div className="space-y-6">
        {sortedKeys.map((key) => {
          const [year, month] = key.split("-").map(Number);
          const lists = grouped.get(key)!;
          const totalEntries = lists.reduce((s, l) => s + l.entries.length, 0);
          const filledTotal = lists.reduce((s, l) => s + filledEntries(l), 0);

          return (
            <section key={key}>
              {/* Month header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                    {MONTH_NAMES[month - 1]} {year}
                  </h2>
                  <span className="text-xs text-slate-300">
                    {lists.length} laporan · {filledTotal}/{totalEntries} hari
                    terisi
                  </span>
                </div>
                <div className="h-px flex-1 bg-slate-200 ml-4" />
              </div>

              {/* Card */}
              <div className=" rounded-xl border border-slate-400 shadow-sm overflow-hidden">
                {lists.map((list) => (
                  <AttendanceRow key={list.id} list={list} />
                ))}
              </div>
            </section>
          );
        })}

        {/* Bottom CTA */}
        <div className="pt-2 pb-6 flex justify-center">
          <Link
            href="/attendance/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 text-sm font-semibold hover:border-primary hover:text-primary hover:bg-primarytransition-all"
          >
            <Plus />
            Buat Laporan Baru
          </Link>
        </div>
      </div>
    </main>
  );
}
