import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { ModuleShell } from "@/components/ModuleShell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { reportingSubnav } from "@/lib/subnavs";

export const Route = createFileRoute("/reporting/discrepancy")({
  component: Discrepancy,
});

const items = [
  {
    type: "missing",
    field: "API 682 Seal Plan Annexure",
    section: "Annexure-B §4.2",
    severity: "high",
    owner: "Engineering",
  },
  {
    type: "mismatch",
    field: "Flow rate: 850 m³/h vs 920 m³/h (datasheet)",
    section: "p.47 vs Annexure-A",
    severity: "high",
    owner: "Engineering",
  },
  {
    type: "low_conf",
    field: "Operating Temperature range",
    section: "Clause 7.3",
    severity: "medium",
    owner: "Engineering",
  },
  {
    type: "missing",
    field: "Vibration limits (ISO 10816)",
    section: "Technical specs",
    severity: "medium",
    owner: "Engineering",
  },
  {
    type: "mismatch",
    field: "Warranty: 18m vs 24m",
    section: "Clause 18 vs §3",
    severity: "low",
    owner: "Commercial",
  },
  {
    type: "missing",
    field: "Spare parts list (2-year ops)",
    section: "Annexure-E",
    severity: "medium",
    owner: "Sales",
  },
  {
    type: "mismatch",
    field: "LD cap: 7.5% vs 5% (cover letter)",
    section: "Cover vs Clause 14.2",
    severity: "high",
    owner: "Commercial",
  },
];

const sev: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-warning/15 text-warning",
  low: "bg-muted text-muted-foreground",
};

function Discrepancy() {
  return (
    <ModuleShell
      eyebrow="Module 05 · Reporting"
      title="Discrepancy Report"
      description="Highlights missing data, inconsistencies, and mismatches. Flags areas requiring manual validation."
      subnav={reportingSubnav}
    >
      <Card>
        <CardContent className="p-6 space-y-3">
          {items.map((d, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/30 transition-colors flex-wrap"
            >
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${sev[d.severity]}`}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{d.field}</p>
                <p className="text-xs text-muted-foreground">{d.section}</p>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {d.owner}
              </Badge>
              <Badge variant="secondary" className={sev[d.severity]}>
                {d.type.replace("_", " ")}
              </Badge>
              <Button variant="ghost" size="sm">
                Resolve →
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </ModuleShell>
  );
}
