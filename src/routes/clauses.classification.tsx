import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";
import { ModuleShell } from "@/components/ModuleShell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clausesSubnav } from "@/lib/subnavs";

export const Route = createFileRoute("/clauses/classification")({
  component: Classification,
});

const items = [
  {
    title: "Liquidated Damages — Cap at 7.5%",
    category: "Commercial",
    risk: "high",
    standard: "Standard cap: 5%",
    deviation: "+2.5% over policy",
  },
  {
    title: "Performance Bond — 24 months",
    category: "Legal",
    risk: "medium",
    standard: "Standard: 12 months",
    deviation: "+12 months hold",
  },
  {
    title: "NACE MR0175 sour service",
    category: "Technical",
    risk: "low",
    standard: "Aligned",
    deviation: "No deviation",
  },
  {
    title: "Force Majeure — 14-day notice",
    category: "Legal",
    risk: "low",
    standard: "Standard: 30 days",
    deviation: "Tighter notice window",
  },
  {
    title: "Advance payment — 30%",
    category: "Commercial",
    risk: "medium",
    standard: "Preferred: 40%",
    deviation: "-10% cash flow impact",
  },
];

const categoryColor: Record<string, string> = {
  Commercial: "bg-primary/10 text-primary",
  Legal: "bg-accent text-accent-foreground",
  Technical: "bg-success/10 text-success",
};

const riskColor: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-warning/15 text-warning",
  low: "bg-success/10 text-success",
};

function Classification() {
  return (
    <ModuleShell
      eyebrow="Module 03 · Clause Extraction"
      title="Clause Classification"
      description="Semantic NLP classifies clauses into Commercial, Legal, or Technical categories and flags deviations against your standard playbook."
      subnav={clausesSubnav}
    >
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { l: "Commercial", v: "52", c: "text-primary" },
          { l: "Legal", v: "63", c: "text-accent-foreground" },
          { l: "Technical", v: "32", c: "text-success" },
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
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Deviation Analysis
            </h3>
            <Button variant="outline" size="sm">Edit standard playbook</Button>
          </div>
          <div className="space-y-3">
            {items.map((c) => (
              <div key={c.title} className="p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <p className="font-medium">{c.title}</p>
                      <Badge variant="secondary" className={categoryColor[c.category]}>
                        {c.category}
                      </Badge>
                      <Badge variant="secondary" className={riskColor[c.risk]}>
                        {c.risk === "high" && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {c.risk} risk
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{c.standard}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                      <span className="text-foreground font-medium">{c.deviation}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Review</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </ModuleShell>
  );
}
