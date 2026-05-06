import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UploadCloud, FileText, FileSpreadsheet, FileImage, X, CheckCircle2, Loader2, FolderSync } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/ingestion")({
  component: Ingestion,
});

const initialFiles = [
  { name: "ADNOC-PMP-2025-0421.pdf", size: "12.4 MB", type: "pdf", progress: 100, status: "OCR complete" },
  { name: "Datasheet-Annexure-A.xlsx", size: "1.8 MB", type: "xlsx", progress: 100, status: "Parsed" },
  { name: "Scope-of-Work.docx", size: "640 KB", type: "doc", progress: 72, status: "Parsing tables…" },
  { name: "Scanned-Drawings.pdf", size: "28.1 MB", type: "scan", progress: 38, status: "Running OCR…" },
];

function fileIcon(type: string) {
  if (type === "xlsx") return FileSpreadsheet;
  if (type === "scan") return FileImage;
  return FileText;
}

function Ingestion() {
  const [drag, setDrag] = useState(false);
  const [files] = useState(initialFiles);

  return (
    <div className="px-4 md:px-8 py-8 max-w-[1600px] mx-auto">
      <PageHeader
        eyebrow="Module 01"
        title="Document Ingestion"
        description="Batch upload tender documents in any format. Files are securely stored and routed to OCR + parsing pipelines."
        actions={
          <>
            <Button variant="outline">
              <FolderSync className="h-4 w-4" /> Sync SharePoint
            </Button>
            <Button className="bg-gradient-primary shadow-glow">
              <UploadCloud className="h-4 w-4" /> Upload
            </Button>
          </>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
            }}
            className={`border-2 border-dashed transition-all ${
              drag ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            <CardContent className="p-12 text-center">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow mb-4">
                <UploadCloud className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Drop tender documents here</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Supports PDF, DOCX, XLSX, scanned images · up to 500 MB per file
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                {["PDF", "DOCX", "XLSX", "PNG/JPG", "TIFF"].map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>
              <Button className="mt-6">Browse Files</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center justify-between">
                Processing Queue
                <Badge variant="secondary">{files.length} files</Badge>
              </h3>
              <div className="space-y-4">
                {files.map((f) => {
                  const Icon = fileIcon(f.type);
                  return (
                    <div key={f.name} className="flex items-center gap-4 p-3 rounded-lg border bg-muted/30">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="font-medium text-sm truncate">{f.name}</p>
                          <span className="text-xs text-muted-foreground">{f.size}</span>
                        </div>
                        <Progress value={f.progress} className="h-1.5" />
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                          {f.progress === 100 ? (
                            <CheckCircle2 className="h-3 w-3 text-success" />
                          ) : (
                            <Loader2 className="h-3 w-3 animate-spin text-primary" />
                          )}
                          {f.status}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {[
            { label: "Storage Used", value: "184 GB", sub: "of 1 TB SharePoint quota" },
            { label: "OCR Pages Today", value: "12,482", sub: "Avg 0.8s / page" },
            { label: "Parsing Accuracy", value: "98.6%", sub: "Tables + annexures" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
              </CardContent>
            </Card>
          ))}
          <Card className="bg-gradient-primary text-primary-foreground border-0">
            <CardContent className="p-5">
              <h4 className="font-semibold mb-1">Pipeline Health</h4>
              <p className="text-sm opacity-90 mb-3">All ingestion workers operational.</p>
              <div className="flex gap-2">
                <Badge className="bg-white/20 hover:bg-white/30 border-0 text-white">OCR ✓</Badge>
                <Badge className="bg-white/20 hover:bg-white/30 border-0 text-white">Parser ✓</Badge>
                <Badge className="bg-white/20 hover:bg-white/30 border-0 text-white">Storage ✓</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
