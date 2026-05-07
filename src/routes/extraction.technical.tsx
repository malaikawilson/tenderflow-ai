import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Download, Filter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ModuleShell } from "@/components/ModuleShell";
import { Button } from "@/components/ui/button";
import { FieldTable, type ExtractedField } from "@/components/FieldTable";
import { extractionSubnav } from "@/lib/subnavs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/extraction/technical")({
  component: Technical,
});

function Technical() {
  const { technicalFields, activeFileName } = useWorkspace();
  const label = activeFileName ?? "ADNOC-PMP-2025-0421.pdf";
  const pumpPages = useMemo(() => groupFieldsByPump(technicalFields), [technicalFields]);
  const [activePumpIndex, setActivePumpIndex] = useState(0);

  useEffect(() => {
    setActivePumpIndex((current) => Math.min(current, Math.max(pumpPages.length - 1, 0)));
  }, [pumpPages.length]);

  const canGoPrev = activePumpIndex > 0;
  const canGoNext = activePumpIndex < pumpPages.length - 1;
  const visibleRows = pumpPages[activePumpIndex] ?? [];

  return (
    <ModuleShell
      eyebrow="Module 02 · AI Data Extraction"
      title="Technical Data Extraction"
      description="Pump-related specs — flow, head, efficiency, NPSH, materials, applicable standards (API/ISO), power, voltage, frequency, and driver type."
      subnav={extractionSubnav}
      actions={
        <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap">
          <Button variant="outline" type="button">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button type="button">
            <Download className="h-4 w-4" /> Datasheet
          </Button>
        </div>
      }
    >
      <div className="grid xl:grid-cols-2 gap-6 xl:items-stretch min-h-[calc(100vh-10.5rem)]">
        <Card className="flex flex-col min-h-[calc(100vh-10.5rem)] xl:h-auto">
          <CardHeader className="shrink-0 pb-2">
            <CardTitle className="text-base">Original Document Scan</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0 pt-0">
            <div className="text-xs text-muted-foreground shrink-0 mb-2">
              {label} · Page 47 · Dummy scan preview
            </div>
            <div className="flex-1 flex flex-col min-h-0 rounded-lg border bg-muted/20 p-2">
              <iframe
                title="Tender scan preview"
                src="/sample-tender-scan.html"
                className="flex-1 w-full min-h-[min(70vh,720px)] xl:min-h-0 h-full rounded-md border bg-white"
              />
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-col min-h-[calc(100vh-10.5rem)]">
          <div className="mb-3 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Previous pump"
              onClick={() => setActivePumpIndex((idx) => Math.max(0, idx - 1))}
              disabled={!canGoPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-20 text-center text-sm font-medium text-muted-foreground">
              {activePumpIndex + 1} of {pumpPages.length}
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Next pump"
              onClick={() => setActivePumpIndex((idx) => Math.min(pumpPages.length - 1, idx + 1))}
              disabled={!canGoNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <FieldTable rows={visibleRows} />
        </div>
      </div>
    </ModuleShell>
  );
}

const pumpFieldPrefix = /^\s*(?:pump|p)\s*[-_#:]?\s*(\d+)\s*[-:)\]]?\s*/i;
const pumpFieldSuffix = /\s*[(\[]\s*(?:pump|p)\s*[-_#:]?\s*(\d+)\s*[)\]]\s*$/i;

function groupFieldsByPump(rows: ExtractedField[]): ExtractedField[][] {
  if (!rows.length) return [[]];

  const byPump = new Map<number, ExtractedField[]>();
  let detectedPumpCount = 0;

  rows.forEach((row) => {
    const match = row.field.match(pumpFieldPrefix) ?? row.field.match(pumpFieldSuffix);
    const pumpNumber = match ? Number.parseInt(match[1] ?? "0", 10) : null;

    if (pumpNumber && Number.isFinite(pumpNumber) && pumpNumber > 0) {
      detectedPumpCount = Math.max(detectedPumpCount, pumpNumber);
      const normalizedField = row.field
        .replace(pumpFieldPrefix, "")
        .replace(pumpFieldSuffix, "")
        .trim();
      const target = byPump.get(pumpNumber) ?? [];
      target.push({ ...row, field: normalizedField || row.field });
      byPump.set(pumpNumber, target);
      return;
    }

    const target = byPump.get(1) ?? [];
    target.push(row);
    byPump.set(1, target);
  });

  if (!detectedPumpCount) return [rows];
  const totalPumps = Math.max(detectedPumpCount, byPump.size);
  return Array.from({ length: totalPumps }, (_, idx) => byPump.get(idx + 1) ?? []);
}
