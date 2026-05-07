import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { ModuleShell } from "@/components/ModuleShell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { reportingSubnav } from "@/lib/subnavs";

export const Route = createFileRoute("/reporting/summary")({
  component: Summary,
});

const sections = [
  { section: "Pump Specifications", fields: 42, complete: 39, conf: 94 },
  { section: "Materials", fields: 18, complete: 17, conf: 91 },
  { section: "Motor & Driver", fields: 14, complete: 14, conf: 96 },
  { section: "Commercial Terms", fields: 22, complete: 19, conf: 87 },
  { section: "Legal Clauses", fields: 31, complete: 28, conf: 89 },
  { section: "Annexures & Drawings", fields: 57, complete: 49, conf: 82 },
];

function Summary() {
  return (
    <ModuleShell
      eyebrow="Module 05 · Reporting"
      title="Tender Summary Report"
      description="Consolidated view of extracted key parameters. Includes confidence scores for each extracted field."
      subnav={reportingSubnav}
    >
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { l: "Overall Quality", v: "92%", icon: CheckCircle2, c: "text-success" },
          { l: "Completeness", v: "166 / 184", c: "text-primary" },
          { l: "Discrepancies", v: "11", icon: AlertTriangle, c: "text-warning" },
          { l: "Critical Missing", v: "3", icon: XCircle, c: "text-destructive" },
        ].map((s) => (
          <Card key={s.l}>
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground">{s.l}</p>
              <p className={`text-2xl font-bold mt-1 ${s.c}`}>{s.v}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-6 space-y-4">
          {sections.map((s) => (
            <div key={s.section} className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <h4 className="font-semibold">{s.section}</h4>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground">
                    {s.complete}/{s.fields} fields
                  </span>
                  <Badge
                    variant="secondary"
                    className={
                      s.conf >= 90 ? "bg-success/10 text-success" : "bg-warning/15 text-warning"
                    }
                  >
                    {s.conf}% conf.
                  </Badge>
                </div>
              </div>
              <Progress value={(s.complete / s.fields) * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </ModuleShell>
  );
}
