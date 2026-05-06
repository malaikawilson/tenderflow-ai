import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, FileText, MapPin } from "lucide-react";
import { ModuleShell } from "@/components/ModuleShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { chatSubnav } from "@/lib/subnavs";

export const Route = createFileRoute("/chat/query")({
  component: Query,
});

const results = [
  {
    answer: "NPSH available margin shall be minimum 1.5 m above NPSH required at rated conditions.",
    doc: "ADNOC-PMP-2025-0421.pdf",
    page: 47,
    section: "Technical Spec §3.2.4",
    snippet: "…the Vendor shall ensure NPSHa ≥ NPSHr + 1.5 m at the rated duty point under all operating scenarios…",
  },
  {
    answer: "Pump vibration limits per ISO 10816-3, zone B (good) for new equipment.",
    doc: "Datasheet-Annexure-A.xlsx",
    page: 12,
    section: "Sheet 'Mechanical' · Row 28",
    snippet: "Vibration velocity (rms): ≤ 2.8 mm/s per ISO 10816-3 Zone B for >15 kW machines on rigid foundation.",
  },
  {
    answer: "Cross-reference: Annexure-B clause 4.2 mandates API 682 Plan 53B for hydrocarbon service.",
    doc: "ADNOC-PMP-2025-0421.pdf",
    page: 138,
    section: "Annexure-B §4.2",
    snippet: "…dual mechanical seal arrangement per API 682 Plan 53B with pressurized barrier fluid system…",
  },
];

function Query() {
  const [q, setQ] = useState("NPSH margin requirement");
  return (
    <ModuleShell
      eyebrow="Module 04 · Conversational AI"
      title="Document Querying"
      description="Contextual search across full documents — including annexures and tables — returning precise answers with traceable source references."
      subnav={chatSubnav}
    >
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Ask a precise question…"
                className="pl-9"
              />
            </div>
            <Button className="bg-gradient-primary">Query</Button>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {["Vibration limits", "Seal plan API 682", "Lifting lugs", "Coupling alignment", "Hydrostatic test pressure"].map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => setQ(t)}
              >
                {t}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {results.map((r, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-primary">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium mb-2">{r.answer}</p>
                  <div className="rounded-lg bg-muted/40 border-l-2 border-primary/40 p-3 mb-3">
                    <p className="text-sm italic text-muted-foreground">"{r.snippet}"</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" /> {r.doc}
                    </span>
                    <span className="flex items-center gap-1 text-primary">
                      <MapPin className="h-3 w-3" /> {r.section} · p.{r.page}
                    </span>
                    <Button variant="ghost" size="sm" className="ml-auto">Open in viewer →</Button>
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
