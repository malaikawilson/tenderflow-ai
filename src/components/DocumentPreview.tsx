import { FileText, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Download, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Highlight {
  top: string;
  left: string;
  width: string;
  height: string;
  label: string;
  tone?: "primary" | "warning" | "success";
}

interface DocumentPreviewProps {
  fileName: string;
  pageNumber: number;
  totalPages: number;
  title: string;
  sections: { heading?: string; lines: string[] }[];
  highlights?: Highlight[];
  pageLabel?: string;
}

const toneClass: Record<string, string> = {
  primary: "border-primary/60 bg-primary/10",
  warning: "border-warning/70 bg-warning/15",
  success: "border-success/70 bg-success/15",
};

export function DocumentPreview({
  fileName,
  pageNumber,
  totalPages,
  title,
  sections,
  highlights = [],
  pageLabel,
}: DocumentPreviewProps) {
  const [zoom, setZoom] = useState(100);

  return (
    <div className="rounded-xl border bg-muted/30 overflow-hidden flex flex-col h-[calc(100vh-16rem)] min-h-[640px] sticky top-20">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-card/80 backdrop-blur">
        <FileText className="h-4 w-4 text-primary shrink-0" />
        <p className="text-xs font-medium truncate flex-1">{fileName}</p>
        <Badge variant="secondary" className="text-[10px] h-5">
          OCR · 99.2%
        </Badge>
      </div>

      <div className="flex items-center justify-between gap-2 px-3 py-1.5 border-b bg-muted/40 text-xs">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span className="tabular-nums">
            {pageNumber} / {totalPages}
          </span>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom((z) => Math.max(60, z - 10))}>
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="tabular-nums w-10 text-center">{zoom}%</span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom((z) => Math.min(160, z + 10))}>
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Scanned page */}
      <div className="flex-1 overflow-auto p-6 bg-[radial-gradient(circle_at_50%_0%,oklch(0.95_0.02_240),transparent_60%)]">
        <div
          className="mx-auto bg-white text-slate-800 shadow-2xl border border-slate-200 origin-top transition-transform"
          style={{
            width: "100%",
            maxWidth: "640px",
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
          }}
        >
          {/* Page header */}
          <div className="px-8 pt-8 pb-4 border-b border-slate-200">
            <div className="flex items-start justify-between text-[10px] text-slate-500 uppercase tracking-wider mb-3">
              <span>{fileName.replace(/\.[^.]+$/, "")}</span>
              <span>Page {pageNumber}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">{title}</h2>
            {pageLabel && <p className="text-[11px] text-slate-500 mt-1">{pageLabel}</p>}
          </div>

          {/* Body */}
          <div className="relative px-8 py-6 space-y-5 text-[11px] leading-[1.6] font-serif text-slate-700">
            {sections.map((s, i) => (
              <div key={i}>
                {s.heading && (
                  <h3 className="text-[12px] font-bold text-slate-900 mb-1.5 uppercase tracking-wide font-sans">
                    {s.heading}
                  </h3>
                )}
                {s.lines.map((line, j) => (
                  <p key={j} className="mb-1">
                    {line}
                  </p>
                ))}
              </div>
            ))}

            {/* OCR highlights */}
            {highlights.map((h, i) => (
              <div
                key={i}
                className={`absolute border-2 rounded ${toneClass[h.tone ?? "primary"]} pointer-events-none animate-in fade-in duration-500`}
                style={{ top: h.top, left: h.left, width: h.width, height: h.height }}
              >
                <span className="absolute -top-5 left-0 text-[9px] font-semibold uppercase tracking-wider text-primary bg-card px-1.5 py-0.5 rounded shadow-sm border whitespace-nowrap">
                  {h.label}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-8 py-3 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400">
            <span>CONFIDENTIAL · Vendor: Pump Solutions Inc.</span>
            <span>{pageNumber} of {totalPages}</span>
          </div>
        </div>
      </div>

      <div className="border-t bg-card/80 px-3 py-2 flex items-center gap-2 text-[11px] text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
        <span>Live-linked to extraction · click any field on the right to jump to its source</span>
      </div>
    </div>
  );
}
