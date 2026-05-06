import { createFileRoute } from "@tanstack/react-router";
import { ScanText, Table2, FileText, CheckCircle2, Loader2, Eye } from "lucide-react";
import { ModuleShell } from "@/components/ModuleShell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ingestionSubnav } from "@/lib/subnavs";

export const Route = createFileRoute("/ingestion/ocr")({
  component: OCR,
});

const queue = [
  { name: "ADNOC-PMP-2025-0421.pdf", pages: 184, ocr: 100, parse: 100, tables: 47, status: "done" },
  { name: "Scanned-Drawings.pdf", pages: 96, ocr: 78, parse: 0, tables: 0, status: "ocr" },
  { name: "Saudi-Aramco-9912.pdf", pages: 412, ocr: 100, parse: 64, tables: 122, status: "parsing" },
  { name: "Annexures-Bundle.pdf", pages: 268, ocr: 100, parse: 100, tables: 38, status: "done" },
];

function OCR() {
  return (
    <ModuleShell
      eyebrow="Module 01 · Document Ingestion"
      title="OCR & Parsing"
      description="Automated OCR on scanned/image PDFs and intelligent parsing of complex tables, annexures, and attachments for downstream AI pipelines."
      subnav={ingestionSubnav}
    >
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { l: "Pages OCR'd Today", v: "12,482", icon: ScanText },
          { l: "Tables Parsed", v: "3,418", icon: Table2 },
          { l: "Avg OCR Speed", v: "0.8s/page" },
          { l: "Parsing Accuracy", v: "98.6%" },
        ].map((s) => (
          <Card key={s.l}>
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground">{s.l}</p>
              <p className="text-2xl font-bold mt-1">{s.v}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Pipeline Status</h3>
          <div className="space-y-4">
            {queue.map((q) => (
              <div key={q.name} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{q.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {q.pages} pages · {q.tables} tables detected
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {q.status === "done" ? (
                      <Badge className="bg-success/10 text-success border-0">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Ready
                      </Badge>
                    ) : (
                      <Badge className="bg-primary/10 text-primary border-0">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        {q.status === "ocr" ? "OCR running" : "Parsing tables"}
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">OCR (Tesseract + Layout)</span>
                      <span className="font-medium">{q.ocr}%</span>
                    </div>
                    <Progress value={q.ocr} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">Table & annexure parsing</span>
                      <span className="font-medium">{q.parse}%</span>
                    </div>
                    <Progress value={q.parse} className="h-1.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </ModuleShell>
  );
}
