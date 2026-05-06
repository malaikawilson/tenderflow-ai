import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Wrench, Banknote, Scale, Loader2 } from "lucide-react";
import { ModuleShell } from "@/components/ModuleShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { chatSubnav } from "@/lib/subnavs";

export const Route = createFileRoute("/chat/summarize")({
  component: Summarize,
});

const tabs = [
  { id: "full", label: "Full Tender", icon: Sparkles },
  { id: "tech", label: "Technical", icon: Wrench },
  { id: "comm", label: "Commercial", icon: Banknote },
  { id: "legal", label: "Legal", icon: Scale },
];

const summaries: Record<string, { title: string; bullets: string[] }> = {
  full: {
    title: "Tender at a glance — ADNOC-PMP-2025-0421",
    bullets: [
      "Scope: Supply of 4 × API 610 BB3 horizontal centrifugal pumps for crude oil export at Habshan-5.",
      "Estimated contract value: USD 19M, delivery DDP Jebel Ali in 26 weeks ex-works.",
      "Key risks: LD cap 7.5% (above standard), 24-month performance bond retention, NACE MR0175 compliance mandatory.",
      "Confidence quality: 92% overall extraction confidence; 11 fields flagged for engineering review.",
      "Recommended action: Engineering sign-off on materials, Commercial to negotiate LD cap to 5%.",
    ],
  },
  tech: {
    title: "Technical summary",
    bullets: [
      "Pump duty: 850 m³/h × 245 m TDH at 78.5% BEP efficiency, NPSHr 4.8 m.",
      "Materials: Duplex SS A890 Gr. 4A casing / Gr. 5A impeller, NACE MR0175 compliant.",
      "Driver: 1250 kW TEFC IE3 motor, 11 kV / 50 Hz with VFD-ready windings.",
      "Standards: API 610 12th ed., API 682 Plan 53B seals, ISO 10816-3 Zone B vibration.",
      "Critical gaps: API 682 seal plan annex incomplete; vibration acceptance criteria need clarification.",
    ],
  },
  comm: {
    title: "Commercial summary",
    bullets: [
      "Payment: 30% LOI, 60% delivery, 10% retained 24 months against PG.",
      "Currency: USD; Validity: 120 days from bid submission.",
      "LD: 0.5%/week, max 7.5% — DEVIATION from internal 5% cap policy.",
      "Inco: DDP Jebel Ali; Insurance: Marine + 110% replacement.",
      "Inspections: 3 × witnessed FAT including string test; TPI by Lloyd's.",
    ],
  },
  legal: {
    title: "Legal summary",
    bullets: [
      "Force majeure notice window: 14 days (tighter than standard 30 days).",
      "Warranty: 18 months from commissioning OR 24 from despatch (earlier).",
      "Confidentiality: 5 years post-contract; IP retained by ADNOC for site drawings.",
      "Governing law: UAE Federal Law, arbitration in Abu Dhabi (DIFC-LCIA).",
      "Termination for convenience: ADNOC may terminate with 60 days notice; vendor compensated for incurred costs only.",
    ],
  },
};

function Summarize() {
  const [tab, setTab] = useState("full");
  const [loading, setLoading] = useState(false);
  const s = summaries[tab];

  const regen = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <ModuleShell
      eyebrow="Module 04 · Conversational AI"
      title="Summarization"
      description="On-demand summaries of the entire tender or specific sections — technical, commercial, or legal — for fast high-level review."
      subnav={chatSubnav}
      actions={
        <Button onClick={regen} className="bg-gradient-primary">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Regenerate
        </Button>
      }
    >
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              tab === t.id
                ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow"
                : "bg-card hover:bg-muted/50"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-primary/10 text-primary border-0">
              <Sparkles className="h-3 w-3 mr-1" /> AI-generated
            </Badge>
            <span className="text-xs text-muted-foreground">Generated just now · 1.4s</span>
          </div>
          <h2 className="text-2xl font-bold mb-6">{s.title}</h2>
          <ul className="space-y-4">
            {s.bullets.map((b, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-foreground/90 leading-relaxed">{b}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </ModuleShell>
  );
}
