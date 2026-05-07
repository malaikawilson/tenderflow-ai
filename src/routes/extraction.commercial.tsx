import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Download } from "lucide-react";
import { ModuleShell } from "@/components/ModuleShell";
import { Button } from "@/components/ui/button";
import { FieldTable } from "@/components/FieldTable";
import { extractionSubnav } from "@/lib/subnavs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspace } from "@/lib/workspace";
import { buildCommercialScanSnippet } from "@/lib/simulation";

export const Route = createFileRoute("/extraction/commercial")({
  component: Commercial,
});

function Commercial() {
  const { commercialFields, activeFileName } = useWorkspace();
  const label = activeFileName ?? "ADNOC-PMP-2025-0421.pdf";
  const commercialScan = useMemo(
    () => buildCommercialScanSnippet(commercialFields, label),
    [commercialFields, label],
  );

  return (
    <ModuleShell
      eyebrow="Module 02 · AI Data Extraction"
      title="Commercial Data Extraction"
      description="Key commercial terms — payment, delivery, warranty/guarantee, LD, penalty clauses, and compliance/regulatory requirements."
      subnav={extractionSubnav}
      actions={
        <Button type="button">
          <Download className="h-4 w-4" /> Export
        </Button>
      }
    >
      <div className="grid xl:grid-cols-2 gap-6">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Original Document Scan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/20 p-4 min-h-[540px] flex flex-col gap-3">
              <div className="text-xs text-muted-foreground">
                {label} · Page 88 · Dummy scan preview
              </div>
              <iframe
                title="Tender scan preview"
                src="/sample-tender-scan.html"
                className="w-full h-[280px] rounded-md border bg-white"
              />
              <pre className="flex-1 min-h-[200px] rounded-md border bg-background p-4 text-xs whitespace-pre-wrap font-mono text-muted-foreground overflow-auto">
                {commercialScan}
              </pre>
            </div>
          </CardContent>
        </Card>
        <div>
          <FieldTable rows={commercialFields} />
        </div>
      </div>
    </ModuleShell>
  );
}
