import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  FileImage,
  X,
  CheckCircle2,
  Loader2,
  FolderSync,
  Cloud,
  Database,
  Lock,
  ArrowRight,
} from "lucide-react";
import { ModuleShell } from "@/components/ModuleShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/upload")({
  component: Upload,
});

const uploadSubnav = [{ to: "/upload", label: "File Upload & Management" }];

function icon(t: string) {
  if (t === "xlsx") return FileSpreadsheet;
  if (t === "scan") return FileImage;
  if (t === "pdf") return FileText;
  return FileText;
}

function fileKind(name: string): string {
  const n = name.toLowerCase();
  if (n.endsWith(".xlsx") || n.endsWith(".xls")) return "xlsx";
  if (n.endsWith(".png") || n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".tiff"))
    return "scan";
  return "pdf";
}

function Upload() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const { uploads, addFilesOnUploadPage, removeUpload, runProceedToExtraction } = useWorkspace();

  const hasReady = uploads.some((u) => u.done);

  const onFiles = (list: FileList | null) => {
    if (!list?.length) return;
    addFilesOnUploadPage(list);
  };

  const handleProceed = () => {
    runProceedToExtraction();
    navigate({ to: "/extraction/technical" });
  };

  return (
    <ModuleShell
      eyebrow="Upload Tender Documents"
      title="File Upload & Management"
      description="Batch upload PDFs, Word, Excel, and scanned files. Securely stored in SharePoint or ERP with full version tracking."
      subnav={uploadSubnav}
      actions={
        <>
          <Button variant="outline" type="button">
            <FolderSync className="h-4 w-4" /> Sync SharePoint
          </Button>
          <Button
            type="button"
            className="bg-gradient-primary shadow-glow"
            disabled={!hasReady}
            onClick={handleProceed}
          >
            Proceed <ArrowRight className="h-4 w-4" />
          </Button>
        </>
      }
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple
        accept=".pdf,.doc,.docx,.xlsx,.xls,.png,.jpg,.jpeg,.tiff"
        onChange={(e) => onFiles(e.target.files)}
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
              onFiles(e.dataTransfer.files);
            }}
            className={`border-2 border-dashed transition-all ${drag ? "border-primary bg-primary/5" : ""}`}
          >
            <CardContent className="p-12 text-center">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow mb-4">
                <UploadCloud className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Drop tender documents here</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Batch upload supported · PDF, DOCX, XLSX, scanned files · up to 500 MB
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                {["PDF", "DOCX", "XLSX", "PNG/JPG", "TIFF"].map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>
              <Button type="button" className="mt-6" onClick={() => inputRef.current?.click()}>
                Browse Files
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recent Uploads</h3>
                <Badge variant="secondary">{uploads.length} files</Badge>
              </div>
              {uploads.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No files yet — drag files above or choose Browse Files. When at least one upload
                  completes, use <strong>Proceed</strong> to run extraction.
                </p>
              ) : (
                <div className="space-y-3">
                  {uploads.map((f) => {
                    const Icon = icon(fileKind(f.name));
                    return (
                      <div
                        key={f.id}
                        className="flex items-center gap-4 p-3 rounded-lg border bg-muted/30"
                      >
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="font-medium text-sm truncate">{f.name}</p>
                            <span className="text-xs text-muted-foreground">{f.sizeLabel}</span>
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
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() => removeUpload(f.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Cloud className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">SharePoint</p>
                  <p className="text-xs text-success">Connected</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-1.5">
                <div className="flex justify-between">
                  <span>Site</span>
                  <span className="text-foreground">tenders.kbl.com</span>
                </div>
                <div className="flex justify-between">
                  <span>Library</span>
                  <span className="text-foreground">Pump Tenders 2025</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage</span>
                  <span className="text-foreground">184 / 1024 GB</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">SAP ERP</p>
                  <p className="text-xs text-success">Connected</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Auto-link tenders to opportunity IDs in ERP for downstream proposal workflows.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-primary text-primary-foreground border-0">
            <CardContent className="p-5">
              <Lock className="h-5 w-5 mb-2" />
              <h4 className="font-semibold mb-1">Secure by default</h4>
              <p className="text-sm opacity-90">
                All files encrypted at rest (AES-256) and in transit (TLS 1.3). RBAC enforced per
                tender.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleShell>
  );
}
