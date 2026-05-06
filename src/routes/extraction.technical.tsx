import { createFileRoute } from "@tanstack/react-router";
import { Download, Filter } from "lucide-react";
import { ModuleShell } from "@/components/ModuleShell";
import { Button } from "@/components/ui/button";
import { FieldTable } from "@/components/FieldTable";
import { extractionSubnav } from "@/lib/subnavs";

export const Route = createFileRoute("/extraction/technical")({
  component: Technical,
});

const rows = [
  { field: "Pump Type", value: "Horizontal Centrifugal, BB3", confidence: 98 },
  { field: "Flow Rate (Capacity)", value: "850 m³/h", confidence: 99 },
  { field: "Total Differential Head", value: "245 m", confidence: 96 },
  { field: "Efficiency (BEP)", value: "78.5 %", confidence: 88 },
  { field: "NPSHr", value: "4.8 m", confidence: 81 },
  { field: "Casing Material", value: "Duplex SS ASTM A890 Gr. 4A", confidence: 92 },
  { field: "Impeller Material", value: "Duplex SS A890 Gr. 5A", confidence: 90 },
  { field: "Shaft Material", value: "Duplex SS UNS S31803", confidence: 89 },
  { field: "Applicable Standard", value: "API 610 12th Edition", confidence: 99 },
  { field: "Secondary Standard", value: "ISO 13709 / API 682 Plan 53B", confidence: 93 },
  { field: "Power (Rated)", value: "1250 kW", confidence: 95 },
  { field: "Voltage", value: "11 kV", confidence: 97 },
  { field: "Frequency", value: "50 Hz", confidence: 99 },
  { field: "Driver Type", value: "TEFC Induction Motor (IE3)", confidence: 87 },
  { field: "Operating Temperature", value: "-10°C to 180°C", confidence: 76 },
  { field: "Design Pressure", value: "62 bar(g)", confidence: 91 },
];

function Technical() {
  return (
    <ModuleShell
      eyebrow="Module 02 · AI Data Extraction"
      title="Technical Data Extraction"
      description="Pump-related specs — flow, head, efficiency, NPSH, materials, applicable standards (API/ISO), power, voltage, frequency, and driver type."
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
      <FieldTable rows={rows} />
    </ModuleShell>
  );
}
