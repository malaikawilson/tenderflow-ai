import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, FileSpreadsheet, FileText, FileJson, FileCode } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { ModuleShell } from "@/components/ModuleShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { reportingSubnav } from "@/lib/subnavs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/reporting/export")({
  component: Export,
});

const formats = [
  {
    fmt: "Excel Datasheet",
    id: "excel-datasheet",
    desc: "Editable internal datasheet template populated with all extracted fields and confidence scores.",
    icon: FileSpreadsheet,
    color: "from-emerald-500 to-green-600",
    tag: "Editable",
  },
  {
    fmt: "PDF Report",
    id: "pdf-report",
    desc: "Non-editable consolidated tender report with discrepancies and review trail.",
    icon: FileText,
    color: "from-rose-500 to-red-600",
    tag: "Non-editable",
  },
  {
    fmt: "JSON",
    id: "json",
    desc: "Structured data for ERP / PLM / analytics integration. Includes source traceability.",
    icon: FileJson,
    color: "from-blue-500 to-indigo-600",
    tag: "Integration",
  },
  {
    fmt: "CSV",
    id: "csv",
    desc: "Tabular fields and clauses for downstream BI dashboards and pivot analysis.",
    icon: FileCode,
    color: "from-cyan-500 to-blue-600",
    tag: "Analytics",
  },
];

function downloadBlob(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function safeFileStem(value: string) {
  return value.replace(/[^a-z0-9-_.]/gi, "-");
}

function Export() {
  const { previewRows, technicalFields, tenderLabel, activeFileName } = useWorkspace();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLabel, setPreviewLabel] = useState("");
  const [previewFormatId, setPreviewFormatId] = useState<string>("");

  const docTitle = tenderLabel ?? activeFileName ?? "TENDER";

  const pumpPreviewRows = useMemo(() => {
    const grouped = new Map<number, Record<string, { value: string; confidence: number; page?: number }>>();
    const detectPump = (field: string) => {
      const prefix = field.match(/^\s*(?:pump|p)\s*[-_#:]?\s*(\d+)\s*[-:)\]]?\s*/i);
      if (prefix?.[1]) return Number.parseInt(prefix[1], 10);
      const suffix = field.match(/\s*[(\[]\s*(?:pump|p)\s*[-_#:]?\s*(\d+)\s*[)\]]\s*$/i);
      if (suffix?.[1]) return Number.parseInt(suffix[1], 10);
      return 1;
    };
    const normalizeField = (field: string) =>
      field
        .replace(/^\s*(?:pump|p)\s*[-_#:]?\s*\d+\s*[-:)\]]?\s*/i, "")
        .replace(/\s*[(\[]\s*(?:pump|p)\s*[-_#:]?\s*\d+\s*[)\]]\s*$/i, "")
        .trim();

    technicalFields.forEach((row) => {
      const pumpNo = detectPump(row.field);
      const key = normalizeField(row.field);
      const target = grouped.get(pumpNo) ?? {};
      target[key] = { value: row.value, confidence: row.confidence, page: row.page };
      grouped.set(pumpNo, target);
    });

    const orderedPumps = Array.from(grouped.keys()).sort((a, b) => a - b);
    return orderedPumps.map((pumpNo) => {
      const data = grouped.get(pumpNo) ?? {};
      return {
        pumpName: `Pump ${pumpNo}`,
        flow: data["Flow Rate (Capacity)"]?.value ?? "—",
        head: data["Total Differential Head"]?.value ?? "—",
        efficiency: data["Efficiency (BEP)"]?.value ?? "—",
        npsh: data["NPSHr"]?.value ?? "—",
        materialOfConstruction: [data["Casing Material"]?.value, data["Pump Type"]?.value]
          .filter(Boolean)
          .join("; ") || "—",
        applicableStandards: data["Applicable Standard"]?.value ?? "—",
        power: data["Power (Rated)"]?.value ?? "—",
        voltage: data["Voltage"]?.value ?? "—",
        frequency: data["Frequency"]?.value ?? "—",
        driver: data["Driver Type"]?.value ?? "—",
      };
    });
  }, [technicalFields]);

  const commercialPreviewRows = useMemo(
    () => previewRows.filter((row) => row.section === "Commercial"),
    [previewRows],
  );

  const isVerticalPreview = previewFormatId === "pdf-report" || previewFormatId === "json";

  const buildExportPayload = () => ({
    document: docTitle,
    generatedAt: new Date().toISOString(),
    parameters: previewRows.map((r) => ({
      parameter: r.parameter,
      value: r.value,
      confidence: r.confidence,
      section: r.section,
      sourcePage: r.sourcePage,
    })),
  });

  const handleDownload = (kind: string) => {
    const payload = buildExportPayload();
    const fileStem = safeFileStem(`PumpIQ-${docTitle}`);
    const technicalColumns = [
      "Pump Name",
      "Flow",
      "Head",
      "Efficiency",
      "NPSH (Net Positive Suction Head)",
      "Material of Construction",
      "Applicable Standards (API, ISO, etc.)",
      "Power",
      "Voltage",
      "Frequency",
      "Driver Type",
    ];
    const technicalRows = pumpPreviewRows.map((row) => [
      row.pumpName,
      row.flow,
      row.head,
      row.efficiency,
      row.npsh,
      row.materialOfConstruction,
      row.applicableStandards,
      row.power,
      row.voltage,
      row.frequency,
      row.driver,
    ]);
    const commercialColumns = ["Parameter", "Value", "Confidence", "Source"];
    const commercialRows = commercialPreviewRows.map((row) => [
      row.parameter,
      row.value,
      row.confidence,
      row.sourcePage,
    ]);

    if (kind === "json") {
      downloadBlob(
        `${fileStem}-export.json`,
        JSON.stringify(
          {
            document: payload.document,
            generatedAt: payload.generatedAt,
            tables: {
              technical: {
                columns: technicalColumns,
                rows: technicalRows.map((r) => Object.fromEntries(technicalColumns.map((c, i) => [c, r[i]]))),
              },
              commercial: {
                columns: commercialColumns,
                rows: commercialRows.map((r) => Object.fromEntries(commercialColumns.map((c, i) => [c, r[i]]))),
              },
            },
          },
          null,
          2,
        ),
        "application/json;charset=utf-8",
      );
      return;
    }
    if (kind === "csv") {
      const csvEscape = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
      const techHeader = technicalColumns.map(csvEscape).join(",");
      const techBody = technicalRows.map((row) => row.map(csvEscape).join(",")).join("\n");
      const commHeader = commercialColumns.map(csvEscape).join(",");
      const commBody = commercialRows.map((row) => row.map(csvEscape).join(",")).join("\n");
      const csv = [
        "Technical Parameters by Pump",
        techHeader,
        techBody,
        "",
        "Commercial and Source Context",
        commHeader,
        commBody,
      ].join("\n");
      downloadBlob(`${fileStem}-datasheet.csv`, csv, "text/csv;charset=utf-8");
      return;
    }
    if (kind === "excel-datasheet") {
      const technicalSheetRows = pumpPreviewRows.map((row) => ({
        "Pump Name": row.pumpName,
        Flow: row.flow,
        Head: row.head,
        Efficiency: row.efficiency,
        "NPSH (Net Positive Suction Head)": row.npsh,
        "Material of Construction": row.materialOfConstruction,
        "Applicable Standards (API, ISO, etc.)": row.applicableStandards,
        Power: row.power,
        Voltage: row.voltage,
        Frequency: row.frequency,
        "Driver Type": row.driver,
      }));
      const commercialSheetRows = commercialPreviewRows.map((row) => ({
        Parameter: row.parameter,
        Value: row.value,
        Confidence: row.confidence,
        Section: row.section,
        Source: row.sourcePage,
      }));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(
          technicalSheetRows.length
            ? technicalSheetRows
            : [
                {
                  "Pump Name": "—",
                  Flow: "—",
                  Head: "—",
                  Efficiency: "—",
                },
              ],
        ),
        "Technical",
      );
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(
          commercialSheetRows.length
            ? commercialSheetRows
            : [{ Parameter: "—", Value: "—", Confidence: "—", Section: "—", Source: "—" }],
        ),
        "Commercial",
      );
      XLSX.writeFile(workbook, `${fileStem}-datasheet.xlsx`);
      return;
    }
    if (kind === "pdf-report") {
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      pdf.setFontSize(14);
      pdf.text("PumpIQ Export Report", 40, 40);
      pdf.setFontSize(10);
      pdf.text(`Document: ${docTitle}`, 40, 56);
      pdf.text(`Generated: ${payload.generatedAt}`, 40, 70);

      autoTable(pdf, {
        startY: 86,
        head: [technicalColumns],
        body: technicalRows.length ? technicalRows : [["—", "—", "—", "—", "—", "—", "—", "—", "—", "—", "—"]],
        theme: "grid",
        headStyles: { fillColor: [235, 238, 242], textColor: 30, fontStyle: "bold" },
        styles: { fontSize: 8, cellPadding: 4, overflow: "linebreak" },
        margin: { left: 40, right: 40 },
      });

      const afterTechnicalY = (pdf as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? 120;
      autoTable(pdf, {
        startY: afterTechnicalY + 18,
        head: [commercialColumns],
        body: commercialRows.length ? commercialRows : [["—", "—", "—", "—"]],
        theme: "grid",
        headStyles: { fillColor: [235, 238, 242], textColor: 30, fontStyle: "bold" },
        styles: { fontSize: 9, cellPadding: 4, overflow: "linebreak" },
        margin: { left: 40, right: 40 },
      });

      pdf.save(`${fileStem}-report.pdf`);
    }
  };

  return (
    <ModuleShell
      eyebrow="Module 05 · Reporting"
      title="Export Formats"
      description="One-click export of structured tender data in editable Excel, non-editable PDF, JSON, or CSV for downstream systems."
      subnav={reportingSubnav}
      actions={
        <Button type="button" onClick={() => handleDownload("csv")}>
          <Download className="h-4 w-4" /> Export All
        </Button>
      }
    >
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent
          className={`flex h-[calc(100dvh-0.5rem)] max-h-[calc(100dvh-0.5rem)] flex-col gap-3 overflow-hidden p-4 ${
            isVerticalPreview
              ? "w-[min(96vw,860px)] max-w-[min(96vw,860px)] sm:max-w-[860px]"
              : "w-[calc(100vw-0.5rem)] max-w-[calc(100vw-0.5rem)] sm:max-w-[calc(100vw-0.5rem)]"
          }`}
        >
          <DialogHeader className="shrink-0 space-y-1 pr-10 text-left">
            <DialogTitle>Export preview — {previewLabel}</DialogTitle>
            <DialogDescription>
              Simulated extraction for <strong>{docTitle}</strong>.{" "}
              {isVerticalPreview
                ? "Vertical document-style layout for non-editable exports."
                : "Parameters are shown per pump row so you can compare extracted technical values across all pumps."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border bg-card">
            <div className="min-h-0 flex-1 overflow-auto">
              {isVerticalPreview ? (
                <div className="space-y-6 p-4">
                  <div className="rounded-md border">
                    <div className="border-b bg-muted/40 px-4 py-3 text-sm font-semibold">
                      Technical Parameters by Pump
                    </div>
                    <div className="space-y-4 p-4">
                      {pumpPreviewRows.map((row) => (
                        <div key={row.pumpName} className="rounded-md border">
                          <div className="border-b bg-muted/30 px-4 py-2 text-sm font-semibold">
                            {row.pumpName}
                          </div>
                          <table className="w-full border-collapse text-sm">
                            <tbody>
                              <tr className="border-b">
                                <td className="w-1/3 px-4 py-2 font-medium">Flow</td>
                                <td className="px-4 py-2 text-muted-foreground">{row.flow}</td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-4 py-2 font-medium">Head</td>
                                <td className="px-4 py-2 text-muted-foreground">{row.head}</td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-4 py-2 font-medium">Efficiency</td>
                                <td className="px-4 py-2 text-muted-foreground">{row.efficiency}</td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-4 py-2 font-medium">
                                  NPSH (Net Positive Suction Head)
                                </td>
                                <td className="px-4 py-2 text-muted-foreground">{row.npsh}</td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-4 py-2 font-medium">Material of Construction</td>
                                <td className="px-4 py-2 text-muted-foreground">
                                  {row.materialOfConstruction}
                                </td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-4 py-2 font-medium">
                                  Applicable Standards (API, ISO, etc.)
                                </td>
                                <td className="px-4 py-2 text-muted-foreground">
                                  {row.applicableStandards}
                                </td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-4 py-2 font-medium">Power</td>
                                <td className="px-4 py-2 text-muted-foreground">{row.power}</td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-4 py-2 font-medium">Voltage</td>
                                <td className="px-4 py-2 text-muted-foreground">{row.voltage}</td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-4 py-2 font-medium">Frequency</td>
                                <td className="px-4 py-2 text-muted-foreground">{row.frequency}</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2 font-medium">Driver Type</td>
                                <td className="px-4 py-2 text-muted-foreground">{row.driver}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <div className="border-b bg-muted/40 px-4 py-3 text-sm font-semibold">
                      Commercial and Source Context
                    </div>
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b bg-muted/30">
                          <th className="px-4 py-2 text-left text-xs font-semibold">Parameter</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold">Value</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold">Confidence</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold">Source</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commercialPreviewRows.map((row, idx) => (
                          <tr key={`${row.parameter}-${idx}`} className="border-b">
                            <td className="px-4 py-2 font-medium">{row.parameter}</td>
                            <td className="px-4 py-2 text-muted-foreground">{row.value}</td>
                            <td className="px-4 py-2 text-muted-foreground">{row.confidence}</td>
                            <td className="px-4 py-2 text-muted-foreground">{row.sourcePage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <table className="w-max min-w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="sticky left-0 z-10 border-r bg-muted/90 px-4 py-4 text-xs font-semibold whitespace-nowrap shadow-[2px_0_6px_-2px_rgba(0,0,0,0.08)]">
                        Pump Name
                      </th>
                      <th className="border-r px-4 py-4 text-xs font-semibold">Flow</th>
                      <th className="border-r px-4 py-4 text-xs font-semibold">Head</th>
                      <th className="border-r px-4 py-4 text-xs font-semibold">Efficiency</th>
                      <th className="border-r px-4 py-4 text-xs font-semibold">
                        NPSH (Net Positive Suction Head)
                      </th>
                      <th className="border-r px-4 py-4 text-xs font-semibold">
                        Material of Construction
                      </th>
                      <th className="border-r px-4 py-4 text-xs font-semibold">
                        Applicable Standards (API, ISO, etc.)
                      </th>
                      <th className="border-r px-4 py-4 text-xs font-semibold">Power</th>
                      <th className="border-r px-4 py-4 text-xs font-semibold">Voltage</th>
                      <th className="border-r px-4 py-4 text-xs font-semibold">Frequency</th>
                      <th className="border-r px-4 py-4 text-xs font-semibold">Driver Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pumpPreviewRows.map((row) => (
                      <tr key={row.pumpName} className="border-b">
                        <td className="sticky left-0 z-10 border-r bg-muted/50 px-4 py-5 text-sm font-medium whitespace-nowrap shadow-[2px_0_6px_-2px_rgba(0,0,0,0.06)]">
                          {row.pumpName}
                        </td>
                        <td className="border-r px-4 py-5 text-muted-foreground">{row.flow}</td>
                        <td className="border-r px-4 py-5 text-muted-foreground">{row.head}</td>
                        <td className="border-r px-4 py-5 text-muted-foreground">{row.efficiency}</td>
                        <td className="border-r px-4 py-5 text-muted-foreground">{row.npsh}</td>
                        <td className="border-r px-4 py-5 text-muted-foreground">
                          {row.materialOfConstruction}
                        </td>
                        <td className="border-r px-4 py-5 text-muted-foreground">
                          {row.applicableStandards}
                        </td>
                        <td className="border-r px-4 py-5 text-muted-foreground">{row.power}</td>
                        <td className="border-r px-4 py-5 text-muted-foreground">{row.voltage}</td>
                        <td className="border-r px-4 py-5 text-muted-foreground">{row.frequency}</td>
                        <td className="border-r px-4 py-5 text-muted-foreground">{row.driver}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid md:grid-cols-2 gap-4">
        {formats.map((e) => (
          <Card key={e.fmt} className="hover:shadow-elegant transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-br ${e.color} flex items-center justify-center shadow-md`}
                >
                  <e.icon className="h-6 w-6 text-white" />
                </div>
                <Badge variant="secondary">{e.tag}</Badge>
              </div>
              <h4 className="font-semibold mb-1">{e.fmt}</h4>
              <p className="text-sm text-muted-foreground mb-4">{e.desc}</p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setPreviewLabel(e.fmt);
                    setPreviewFormatId(e.id);
                    setPreviewOpen(true);
                  }}
                >
                  Preview
                </Button>
                <Button type="button" className="flex-1" onClick={() => handleDownload(e.id)}>
                  <Download className="h-4 w-4" /> Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleShell>
  );
}
