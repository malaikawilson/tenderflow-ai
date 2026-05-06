import { createFileRoute } from "@tanstack/react-router";
import { Download, FileSpreadsheet, FileText, FileJson, FileCode } from "lucide-react";
import { ModuleShell } from "@/components/ModuleShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { reportingSubnav } from "@/lib/subnavs";

export const Route = createFileRoute("/reporting/export")({
  component: Export,
});

const formats = [
  {
    fmt: "Excel Datasheet",
    desc: "Editable internal datasheet template populated with all extracted fields and confidence scores.",
    icon: FileSpreadsheet,
    color: "from-emerald-500 to-green-600",
    tag: "Editable",
  },
  {
    fmt: "PDF Report",
    desc: "Non-editable consolidated tender report with discrepancies and review trail.",
    icon: FileText,
    color: "from-rose-500 to-red-600",
    tag: "Non-editable",
  },
  {
    fmt: "JSON",
    desc: "Structured data for ERP / PLM / analytics integration. Includes source traceability.",
    icon: FileJson,
    color: "from-blue-500 to-indigo-600",
    tag: "Integration",
  },
  {
    fmt: "CSV",
    desc: "Tabular fields and clauses for downstream BI dashboards and pivot analysis.",
    icon: FileCode,
    color: "from-cyan-500 to-blue-600",
    tag: "Analytics",
  },
];

function Export() {
  return (
    <ModuleShell
      eyebrow="Module 05 · Reporting"
      title="Export Formats"
      description="One-click export of structured tender data in editable Excel, non-editable PDF, JSON, or CSV for downstream systems."
      subnav={reportingSubnav}
      actions={<Button><Download className="h-4 w-4" /> Export All</Button>}
    >
      <div className="grid md:grid-cols-2 gap-4">
        {formats.map((e) => (
          <Card key={e.fmt} className="hover:shadow-elegant transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${e.color} flex items-center justify-center shadow-md`}>
                  <e.icon className="h-6 w-6 text-white" />
                </div>
                <Badge variant="secondary">{e.tag}</Badge>
              </div>
              <h4 className="font-semibold mb-1">{e.fmt}</h4>
              <p className="text-sm text-muted-foreground mb-4">{e.desc}</p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Preview</Button>
                <Button className="flex-1"><Download className="h-4 w-4" /> Download</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleShell>
  );
}
