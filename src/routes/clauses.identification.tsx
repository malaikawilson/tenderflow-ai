import { createFileRoute } from "@tanstack/react-router";
import { Banknote, Scale, Wrench, AlertTriangle, FileSearch } from "lucide-react";
import { ModuleShell } from "@/components/ModuleShell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clausesSubnav } from "@/lib/subnavs";

export const Route = createFileRoute("/clauses/identification")({
  component: Identification,
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
  },
  {
    title: "Warranty Period",
    type: "Warranty",
    icon: Scale,
    excerpt:
      "The Vendor warrants the equipment for 18 months from commissioning or 24 months from despatch, whichever is earlier.",
    page: 102,
    section: "Clause 18.1",
  },
  {
    title: "Payment Schedule",
    type: "Payment",
    icon: Banknote,
    excerpt:
      "30% on LOI, 60% on delivery, 10% retained against Performance Bond valid for 24 months post-commissioning.",
    page: 88,
    section: "Clause 9.3",
  },
  {
    title: "Delivery Schedule",
    type: "Delivery",
    icon: Wrench,
    excerpt:
      "Total delivery period of 26 weeks ex-works including FAT (week 22). DDP Jebel Ali for site delivery.",
    page: 91,
    section: "Clause 11",
  },
];

function Identification() {
  return (
    <ModuleShell
      eyebrow="Module 03 · Clause Extraction"
      title="Clause Identification"
      description="Auto-detect critical contractual clauses — payment terms, warranty, delivery schedules, penalty/LD — across the full document corpus."
      subnav={clausesSubnav}
      actions={<Button><FileSearch className="h-4 w-4" /> Re-run identification</Button>}
    >
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { l: "Total Clauses", v: "147" },
          { l: "Payment", v: "18" },
          { l: "Warranty", v: "12" },
          { l: "LD / Penalty", v: "9" },
        ].map((s) => (
          <Card key={s.l}>
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground">{s.l}</p>
              <p className="text-2xl font-bold mt-1">{s.v}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
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
                    <Badge variant="secondary">{c.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3 mb-3">
                    "{c.excerpt}"
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {c.section} · Page {c.page}
                    </span>
                    <Button variant="ghost" size="sm">View in document →</Button>
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
