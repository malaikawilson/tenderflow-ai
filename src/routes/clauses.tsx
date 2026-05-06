import { createFileRoute } from "@tanstack/react-router";
import { FileSearch, AlertTriangle, Scale, Wrench, Banknote } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/clauses")({
  component: Clauses,
});

const clauses = [
  {
    title: "Liquidated Damages",
    category: "Commercial",
    icon: Banknote,
    excerpt:
      "In the event of delay in delivery, the Vendor shall pay liquidated damages at the rate of 0.5% of the undelivered portion per week, subject to a maximum of 7.5% of the total contract value.",
    page: 84,
    section: "Clause 14.2",
    deviation: true,
    risk: "high",
  },
  {
    title: "Warranty Period",
    category: "Legal",
    icon: Scale,
    excerpt:
      "The Vendor warrants the equipment against defects in material and workmanship for a period of 18 months from commissioning or 24 months from despatch, whichever occurs earlier.",
    page: 102,
    section: "Clause 18.1",
    deviation: false,
    risk: "low",
  },
  {
    title: "Material of Construction Compliance",
    category: "Technical",
    icon: Wrench,
    excerpt:
      "All wetted parts shall conform to NACE MR0175 / ISO 15156 for sour service applications. Impeller shall be manufactured per ASTM A890 Gr. 5A.",
    page: 47,
    section: "Annexure-A §3.4",
    deviation: false,
    risk: "low",
  },
  {
    title: "Payment Terms — Retention",
    category: "Commercial",
    icon: Banknote,
    excerpt:
      "10% of the contract value shall be retained until issuance of Performance Guarantee Certificate, valid for 24 months post commissioning.",
    page: 88,
    section: "Clause 9.3",
    deviation: true,
    risk: "medium",
  },
  {
    title: "Force Majeure",
    category: "Legal",
    icon: Scale,
    excerpt:
      "Neither party shall be liable for failure to perform obligations resulting from acts of God, war, embargo, or governmental restrictions, provided notice is given within 14 days.",
    page: 121,
    section: "Clause 22",
    deviation: false,
    risk: "low",
  },
];

const categoryColor: Record<string, string> = {
  Commercial: "bg-primary/10 text-primary",
  Legal: "bg-accent text-accent-foreground",
  Technical: "bg-success/10 text-success",
};

function Clauses() {
  return (
    <div className="px-4 md:px-8 py-8 max-w-[1600px] mx-auto">
      <PageHeader
        eyebrow="Module 03"
        title="Clause Extraction"
        description="Context-aware NLP identifies critical contractual clauses, classifies them, and flags deviations from your standard terms."
        actions={<Button>Compare to Standard</Button>}
      />

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { l: "Total Clauses", v: "147", icon: FileSearch, c: "text-primary" },
          { l: "Commercial", v: "52", c: "text-primary" },
          { l: "Legal", v: "63", c: "text-accent-foreground" },
          { l: "Deviations", v: "11", icon: AlertTriangle, c: "text-warning" },
        ].map((s) => (
          <Card key={s.l}>
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground">{s.l}</p>
              <p className={`text-2xl font-bold mt-1 ${s.c}`}>{s.v}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {clauses.map((c) => (
          <Card key={c.title} className="hover:shadow-elegant transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="font-semibold">{c.title}</h3>
                    <Badge variant="secondary" className={categoryColor[c.category]}>
                      {c.category}
                    </Badge>
                    {c.deviation && (
                      <Badge variant="secondary" className="bg-warning/15 text-warning">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Deviation flagged
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3 mb-3">
                    "{c.excerpt}"
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {c.section} · Page {c.page}
                    </span>
                    <Button variant="ghost" size="sm">
                      View in document →
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
