import { createFileRoute } from "@tanstack/react-router";
import { Download, Filter } from "lucide-react";
import { ModuleShell } from "@/components/ModuleShell";
import { Button } from "@/components/ui/button";
import { FieldTable } from "@/components/FieldTable";
import { DocumentPreview } from "@/components/DocumentPreview";
import { extractionSubnav } from "@/lib/subnavs";

export const Route = createFileRoute("/extraction/technical")({
  component: Technical,
});

const rows = [
  { field: "Pump Type", value: "Horizontal Centrifugal, BB3", confidence: 98, page: 42 },
  { field: "Flow Rate (Capacity)", value: "850 m³/h", confidence: 99, page: 42 },
  { field: "Total Differential Head", value: "245 m", confidence: 96, page: 42 },
  { field: "Efficiency (BEP)", value: "78.5 %", confidence: 88, page: 42 },
  { field: "NPSHr", value: "4.8 m", confidence: 81, page: 47 },
  { field: "Casing Material", value: "Duplex SS ASTM A890 Gr. 4A", confidence: 92, page: 51 },
  { field: "Impeller Material", value: "Duplex SS A890 Gr. 5A", confidence: 90, page: 51 },
  { field: "Shaft Material", value: "Duplex SS UNS S31803", confidence: 89, page: 51 },
  { field: "Applicable Standard", value: "API 610 12th Edition", confidence: 99, page: 12 },
  { field: "Secondary Standard", value: "ISO 13709 / API 682 Plan 53B", confidence: 93, page: 138 },
  { field: "Power (Rated)", value: "1250 kW", confidence: 95, page: 64 },
  { field: "Voltage", value: "11 kV", confidence: 97, page: 64 },
  { field: "Frequency", value: "50 Hz", confidence: 99, page: 64 },
  { field: "Driver Type", value: "TEFC Induction Motor (IE3)", confidence: 87, page: 64 },
  { field: "Operating Temperature", value: "-10°C to 180°C", confidence: 76, page: 47 },
  { field: "Design Pressure", value: "62 bar(g)", confidence: 91, page: 47 },
];

function Technical() {
  return (
    <ModuleShell
      eyebrow="Module 02 · AI Data Extraction"
      title="Technical Data Extraction"
      description="Pump specs cross-checked against the original scanned datasheet — verify every field at a glance, side-by-side."
      subnav={extractionSubnav}
      actions={
        <>
          <Button variant="outline">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button>
            <Download className="h-4 w-4" /> Datasheet
          </Button>
        </>
      }
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <DocumentPreview
          fileName="ADNOC-PMP-2025-0421.pdf"
          pageNumber={42}
          totalPages={214}
          title="Annexure-A · Pump Mechanical Datasheet"
          pageLabel="Section 3 — Hydraulic & Mechanical Particulars"
          sections={[
            {
              heading: "1. Service Conditions",
              lines: [
                "Pumped Fluid:  Crude Oil (sour, 1.2% H₂S)",
                "Specific Gravity:  0.86 @ 60°C",
                "Operating Temperature:  −10 °C to 180 °C",
                "Design Pressure:  62 bar(g) / Test 93 bar(g)",
              ],
            },
            {
              heading: "2. Pump Selection",
              lines: [
                "Pump Type:  Horizontal Centrifugal, BB3 (between-bearing, multi-stage)",
                "Standard:  API 610 12th Edition / ISO 13709",
                "Rated Flow:  850 m³/h",
                "Rated Differential Head:  245 m",
                "Best-Efficiency-Point:  78.5 % (η at rated)",
                "NPSH required:  4.8 m  (NPSHa shall be ≥ NPSHr + 1.5 m)",
              ],
            },
            {
              heading: "3. Materials of Construction",
              lines: [
                "Casing:  Duplex Stainless Steel — ASTM A890 Gr. 4A",
                "Impeller:  Duplex Stainless Steel — A890 Gr. 5A",
                "Shaft:  Duplex SS UNS S31803, hard-faced sleeves",
                "Wear Rings:  17-4 PH (precipitation-hardened)",
              ],
            },
          ]}
          highlights={[
            { top: "8.5rem", left: "1.5rem", width: "calc(100% - 3rem)", height: "1.4rem", label: "Pump Type · 98%", tone: "success" },
            { top: "11.2rem", left: "1.5rem", width: "calc(100% - 3rem)", height: "1.4rem", label: "Capacity · 99%", tone: "success" },
            { top: "16rem", left: "1.5rem", width: "calc(100% - 3rem)", height: "1.4rem", label: "NPSHr · 81%", tone: "warning" },
          ]}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Extracted Fields · 16 of 184
            </p>
            <p className="text-xs text-muted-foreground">Click a row to jump to source →</p>
          </div>
          <FieldTable rows={rows} />
        </div>
      </div>
    </ModuleShell>
  );
}
