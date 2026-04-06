import React from "react";
import PeriodCard from "./PeriodCard";
import { DocumentationPeriod } from "@/generated/prisma";
import CreatePeriodDialog from "./CreatePeriodDialog";

export default function PeriodList({
  periods,
}: {
  periods: DocumentationPeriod[];
}) {
  return (
    <div className="grid grid-cols-5 border w-full gap-12">
      {periods.map((period) => (
        <PeriodCard key={period.id} period={period} />
      ))}
      <CreatePeriodDialog />
    </div>
  );
}
