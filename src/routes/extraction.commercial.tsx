import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { ModuleShell } from "@/components/ModuleShell";
import { Button } from "@/components/ui/button";
import { FieldTable } from "@/components/FieldTable";
import { DocumentPreview } from "@/components/DocumentPreview";
import { extractionSubnav } from "@/lib/subnavs";

export const Route = createFileRoute("/extraction/commercial")({
  component: Commercial,
});

const rows = [
  { field: "Payment Terms", value: "30% advance, 60% on delivery, 10% after PG", confidence: 94, page: 81 },
  { field: "Delivery Schedule", value: "26 weeks ex-works", confidence: 92, page: 84 },
  { field: "Delivery Location", value: "DDP Jebel Ali, UAE", confidence: 88, page: 84 },
  { field: "Warranty / Guarantee", value: "18 months from commissioning / 24 from despatch", confidence: 90, page: 92 },
  { field: "Performance Bond", value: "10% of contract value, valid 24 months", confidence: 88, page: 88 },
  { field: "Liquidated Damages (LD)", value: "0.5% per week, max 7.5%", confidence: 96, page: 84 },
  { field: "Penalty Clause", value: "Additional 2% for missed FAT milestones", confidence: 79, page: 86 },
  { field: "Compliance Standards", value: "NACE MR0175, ASME B73.1, IEC 60079", confidence: 91, page: 102 },
  { field: "Regulatory Approvals", value: "ATEX Zone 2, IECEx, EAC", confidence: 86, page: 102 },
  { field: "Currency", value: "USD", confidence: 99, page: 81 },
  { field: "Validity Period", value: "120 days from bid submission", confidence: 78, page: 80 },
  { field: "Insurance Requirements", value: "Marine + 110% replacement cover", confidence: 82, page: 95 },
];

function Commercial() {
  return (
    <ModuleShell
      eyebrow="Module 02 · AI Data Extraction"
      title="Commercial Data Extraction"
      description="Payment, delivery, warranty, LD, and compliance terms verified against the original commercial section of the tender."
      subnav={extractionSubnav}
      actions={
        <Button>
          <Download className="h-4 w-4" /> Export
        </Button>
      }
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <DocumentPreview
          fileName="ADNOC-PMP-2025-0421.pdf"
          pageNumber={84}
          totalPages={214}
          title="Section 14 · Commercial Terms & Conditions"
          pageLabel="Volume II — Commercial Bid Requirements"
          sections={[
            {
              heading: "14.1  Delivery & Schedule",
              lines: [
                "Vendor shall deliver complete equipment within 26 weeks ex-works from date of LOI.",
                "Factory Acceptance Test (FAT) at week 22; Site delivery DDP Jebel Ali, UAE at week 26.",
                "Liquidated Damages: 0.5 % of contract value per week of delay, capped at 7.5 %.",
                "An additional penalty of 2 % shall apply for any missed FAT milestone.",
              ],
            },
            {
              heading: "14.2  Payment Terms",
              lines: [
                "30 % advance against irrevocable bank guarantee (issued by an A-rated bank).",
                "60 % on delivery, against shipping documents and inspection release note.",
                "10 % retention, released after Performance Guarantee (PG) test successful.",
                "All payments in United States Dollars (USD).",
              ],
            },
            {
              heading: "14.3  Warranty & Bonds",
              lines: [
                "Warranty: 18 months from commissioning OR 24 months from despatch — whichever is earlier.",
                "Performance Bond: 10 % of contract value, valid for 24 months.",
                "Bid validity: 120 days from the bid submission deadline.",
              ],
            },
          ]}
          highlights={[
            { top: "5.6rem", left: "1.5rem", width: "calc(100% - 3rem)", height: "1.4rem", label: "Delivery · 92%", tone: "success" },
            { top: "9.5rem", left: "1.5rem", width: "calc(100% - 3rem)", height: "1.4rem", label: "LD · 96%", tone: "success" },
            { top: "11rem", left: "1.5rem", width: "calc(100% - 3rem)", height: "1.4rem", label: "Penalty · 79%", tone: "warning" },
          ]}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Commercial Fields · 12 of 47
            </p>
            <p className="text-xs text-muted-foreground">Click a row to jump to source →</p>
          </div>
          <FieldTable rows={rows} />
        </div>
      </div>
    </ModuleShell>
  );
}
