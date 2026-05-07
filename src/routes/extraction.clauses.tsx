import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Banknote, FileSearch, Scale, Wrench } from "lucide-react";
import { ModuleShell } from "@/components/ModuleShell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { extractionSubnav } from "@/lib/subnavs";

export const Route = createFileRoute("/extraction/clauses")({
  component: ClauseInsights,
});

const clauses = [
  {
    title: "Liquidated Damages",
    type: "LD / Penalty",
    icon: Banknote,
    excerpt:
      "In the event of delay in delivery, the Vendor shall pay liquidated damages at 0.5% of the undelivered portion per week, capped at 7.5% of contract value.",
    page: 84,
    section: "Clause 14.2",
    category: "Commercial",
    risk: "high",
    standard: "Standard cap: 5%",
    deviation: "+2.5% over policy",
  },
  {
    title: "Warranty Period",
    type: "Warranty",
    icon: Scale,
    excerpt:
      "The Vendor warrants the equipment for 18 months from commissioning or 24 months from despatch, whichever is earlier.",
    page: 102,
    section: "Clause 18.1",
    category: "Legal",
    risk: "medium",
    standard: "Standard: 12 months",
    deviation: "+12 months hold",
  },
  {
    title: "Payment Schedule",
    type: "Payment",
    icon: Banknote,
    excerpt:
      "30% on LOI, 60% on delivery, 10% retained against Performance Bond valid for 24 months post-commissioning.",
    page: 88,
    section: "Clause 9.3",
    category: "Commercial",
    risk: "medium",
    standard: "Preferred advance: 40%",
    deviation: "-10% cash flow impact",
  },
  {
    title: "Delivery Schedule",
    type: "Delivery",
    icon: Wrench,
    excerpt:
      "Total delivery period of 26 weeks ex-works including FAT (week 22). DDP Jebel Ali for site delivery.",
    page: 91,
    section: "Clause 11",
    category: "Technical",
    risk: "low",
    standard: "Delivery target: 24 weeks",
    deviation: "+2 weeks lead time",
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

function ClauseInsights() {
  return (
    <ModuleShell
      eyebrow="Module 02 · AI Data Extraction"
      title="Clause Insights"
      description="Clause identification and classification are now unified here, combining detection of key commercial/legal clauses with deviation and risk analysis."
      subnav={extractionSubnav}
      actions={
        <Button>
          <FileSearch className="h-4 w-4" /> Re-run clause analysis
        </Button>
      }
    >
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { l: "Total Clauses", v: "147" },
          { l: "Commercial", v: "52" },
          { l: "Legal", v: "63" },
          { l: "Technical", v: "32" },
        ].map((s) => (
          <Card key={s.l}>
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground">{s.l}</p>
              <p className="text-2xl font-bold mt-1">{s.v}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4 mb-8">
        {clauses.map((c) => (
          <Card key={c.title}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="font-semibold">{c.title}</h3>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Identification
                    </Badge>
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      Classification
                    </Badge>
                    <Badge variant="secondary">{c.type}</Badge>
                    <Badge variant="secondary" className={categoryColor[c.category]}>
                      {c.category}
                    </Badge>
                    <Badge variant="secondary" className={riskColor[c.risk]}>
                      {c.risk === "high" && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {c.risk} risk
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3 mb-3">
                    "{c.excerpt}"
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 mb-3">
                    <div className="rounded-md border bg-muted/20 p-3">
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                        Classification Rule
                      </p>
                      <p className="text-sm text-muted-foreground">{c.standard}</p>
                    </div>
                    <div className="rounded-md border bg-muted/20 p-3">
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                        Deviation
                      </p>
                      <p className="text-sm font-medium">{c.deviation}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {c.section} · Page {c.page}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Review classification
                      </Button>
                      <Button variant="ghost" size="sm">
                        View in document →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleShell>
  );
}
