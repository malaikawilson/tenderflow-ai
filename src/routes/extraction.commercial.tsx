import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { ModuleShell } from "@/components/ModuleShell";
import { Button } from "@/components/ui/button";
import { FieldTable } from "@/components/FieldTable";
import { extractionSubnav } from "@/lib/subnavs";

export const Route = createFileRoute("/extraction/commercial")({
  component: Commercial,
});

const rows = [
  { field: "Payment Terms", value: "30% advance, 60% on delivery, 10% after PG", confidence: 94 },
  { field: "Delivery Schedule", value: "26 weeks ex-works", confidence: 92 },
  { field: "Delivery Location", value: "DDP Jebel Ali, UAE", confidence: 88 },
  { field: "Warranty / Guarantee", value: "18 months from commissioning / 24 from despatch", confidence: 90 },
  { field: "Performance Bond", value: "10% of contract value, valid 24 months", confidence: 88 },
  { field: "Liquidated Damages (LD)", value: "0.5% per week, max 7.5%", confidence: 96 },
  { field: "Penalty Clause", value: "Additional 2% for missed FAT milestones", confidence: 79 },
  { field: "Compliance Standards", value: "NACE MR0175, ASME B73.1, IEC 60079", confidence: 91 },
  { field: "Regulatory Approvals", value: "ATEX Zone 2, IECEx, EAC", confidence: 86 },
  { field: "Currency", value: "USD", confidence: 99 },
  { field: "Validity Period", value: "120 days from bid submission", confidence: 78 },
  { field: "Insurance Requirements", value: "Marine + 110% replacement cover", confidence: 82 },
];

function Commercial() {
  return (
    <ModuleShell
      eyebrow="Module 02 · AI Data Extraction"
      title="Commercial Data Extraction"
      description="Key commercial terms — payment, delivery, warranty/guarantee, LD, penalty clauses, and compliance/regulatory requirements."
      subnav={extractionSubnav}
      actions={
        <Button>
          <Download className="h-4 w-4" /> Export
        </Button>
      }
    >
      <FieldTable rows={rows} />
    </ModuleShell>
  );
}
