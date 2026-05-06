import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Eye, Flag } from "lucide-react";
import { ModuleShell } from "@/components/ModuleShell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { extractionSubnav } from "@/lib/subnavs";

export const Route = createFileRoute("/extraction/confidence")({
  component: Confidence,
});

const flagged = [
  { field: "NPSHr", value: "4.8 m", c: 81, why: "Found in two locations with conflicting units (m vs ft)." },
  { field: "Operating Temperature", value: "-10°C to 180°C", c: 76, why: "Range straddles two table cells; OCR ambiguity on minus sign." },
  { field: "Validity Period", value: "120 days", c: 78, why: "Conflicting clauses on cover letter (90 days) vs ITT (120 days)." },
  { field: "Penalty Clause", value: "2% per FAT miss", c: 79, why: "Penalty mentioned in narrative form — not tabular." },
  { field: "Insurance Requirements", value: "Marine + 110%", c: 82, why: "Partial match against expected template phrasing." },
];

function Confidence() {
  return (
    <ModuleShell
      eyebrow="Module 02 · AI Data Extraction"
      title="Confidence Scoring"
      description="Every extracted field is scored. Low-confidence fields are auto-flagged for engineering or commercial review before sign-off."
      subnav={extractionSubnav}
    >
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">High Confidence (≥90%)</p>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </div>
            <p className="text-2xl font-bold text-success">152</p>
            <Progress value={82} className="h-1.5 mt-3" />
            <p className="text-xs text-muted-foreground mt-1">82% of all fields</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Medium (80–89%)</p>
              <Eye className="h-4 w-4 text-warning" />
            </div>
            <p className="text-2xl font-bold text-warning">23</p>
            <Progress value={12} className="h-1.5 mt-3" />
            <p className="text-xs text-muted-foreground mt-1">Recommended spot-check</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Low (&lt;80%)</p>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <p className="text-2xl font-bold text-destructive">9</p>
            <Progress value={6} className="h-1.5 mt-3" />
            <p className="text-xs text-muted-foreground mt-1">Manual review required</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Flag className="h-4 w-4 text-warning" /> Flagged for Review
            </h3>
            <Badge variant="secondary">{flagged.length} fields</Badge>
          </div>
          <div className="space-y-3">
            {flagged.map((f) => (
              <div key={f.field} className="p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
                  <div>
                    <p className="font-medium">{f.field}</p>
                    <p className="text-sm text-muted-foreground">{f.value}</p>
                  </div>
                  <Badge variant="secondary" className="bg-warning/15 text-warning">
                    {f.c}% confidence
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground italic mb-3">↳ {f.why}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">View source</Button>
                  <Button size="sm">Approve value</Button>
                  <Button size="sm" variant="ghost">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </ModuleShell>
  );
}
