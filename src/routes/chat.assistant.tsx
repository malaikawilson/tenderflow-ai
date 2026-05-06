import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Sparkles, FileText, User, Bot, Copy, ThumbsUp, ThumbsDown, RotateCcw, Paperclip, Mic, ChevronRight, Database, BookOpen, Layers } from "lucide-react";
import { ModuleShell } from "@/components/ModuleShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { chatSubnav } from "@/lib/subnavs";

export const Route = createFileRoute("/chat/assistant")({
  component: Assistant,
});

type Source = { doc: string; page: number; section: string };
type Section =
  | { type: "text"; content: string }
  | { type: "heading"; content: string }
  | { type: "list"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "callout"; tone: "info" | "warn" | "success"; title: string; content: string };

type Msg = {
  role: "user" | "ai";
  content?: string;
  blocks?: Section[];
  sources?: Source[];
  meta?: { tokens?: number; latency?: string; model?: string };
};

const initial: Msg[] = [
  {
    role: "user",
    content: "Give me a complete commercial & technical risk readout for the ADNOC pump tender — I'm presenting to the bid committee tomorrow.",
  },
  {
    role: "ai",
    blocks: [
      {
        type: "callout",
        tone: "info",
        title: "Executive summary",
        content:
          "ADNOC-PMP-2025-0421 is a $19.2M bid for 6 × API 610 BB3 multi-stage pumps for the Hail & Ghasha sour-service injection package. Schedule is aggressive (26 weeks) but feasible on our standard platform. Three commercial clauses materially shift risk to the vendor and should be challenged before submission.",
      },
      { type: "heading", content: "1 · Technical scope at a glance" },
      {
        type: "table",
        head: ["Parameter", "Required", "Our standard", "Status"],
        rows: [
          ["Flow rate", "850 m³/h", "650–1100 m³/h", "✓ Within"],
          ["Differential head", "245 m", "Up to 320 m", "✓ Within"],
          ["NPSHa margin", "≥ NPSHr + 1.5 m", "Customer scope", "⚠ Needs site data"],
          ["Materials", "Duplex A890 4A/5A", "Standard offering", "✓ Within"],
          ["Seal plan", "API 682 Plan 53B", "Available", "✓ Within"],
          ["Driver", "11 kV / 50 Hz / IE3 TEFC", "Sourced (Siemens)", "✓ Within"],
        ],
      },
      { type: "heading", content: "2 · Top three commercial risks" },
      {
        type: "list",
        items: [
          "**Liquidated Damages cap at 7.5 %** ($1.44M exposure on $19.2M deal). Industry norm is 5 %. Recommend negotiating a 5 % cap with carve-outs for force-majeure and customer-supplied data delays.",
          "**Bid validity of 120 days** vs our internal 90-day commodity-price window. FX and duplex SS surcharge clauses must be added or we absorb ~$280k of input-cost drift.",
          "**Performance bond of 10 % valid for 24 months** ties up $1.92M of credit lines for two years post-PG. Treasury has flagged this — request reduction to 10 % / 12 months or 5 % / 24 months.",
        ],
      },
      { type: "heading", content: "3 · Schedule reality check" },
      {
        type: "text",
        content:
          "26 weeks ex-works is feasible only if the duplex casing castings are released within week 4 of LOI. Current foundry lead time is 14 weeks — Engineering must pre-book heat numbers at the foundry on bid award. FAT at week 22 leaves a 4-week buffer for shipping to Jebel Ali, which is realistic for sea freight from Genoa.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "Compliance flag",
        content:
          "Annexure-B §4.2 mandates NACE MR0175 + IECEx + ATEX Zone 2 + EAC. Our standard package covers the first three; EAC certification adds 6 weeks and ~$35k. Confirm whether EAC is a bid disqualifier or a post-award deliverable.",
      },
      { type: "heading", content: "4 · Recommended next steps" },
      {
        type: "list",
        items: [
          "Request clarifications C-01 to C-04 (drafted — see Document Querying tab) before the 12 May deadline.",
          "Engineering to validate NPSHa with site team; lock impeller selection at 1.5 m margin minimum.",
          "Commercial to redline §14.1 (LD cap), §14.2 (validity), §14.3 (bond) prior to submission.",
          "Finance to model FX exposure on USD-denominated bid against EUR-cost base.",
        ],
      },
    ],
    sources: [
      { doc: "ADNOC-PMP-2025-0421.pdf", page: 42, section: "Annexure-A · Datasheet" },
      { doc: "ADNOC-PMP-2025-0421.pdf", page: 84, section: "§14.1 Delivery & LD" },
      { doc: "ADNOC-PMP-2025-0421.pdf", page: 92, section: "§14.3 Warranty & Bonds" },
      { doc: "ADNOC-PMP-2025-0421.pdf", page: 138, section: "Annexure-B §4.2 Compliance" },
    ],
    meta: { tokens: 1842, latency: "3.2s", model: "PumpIQ-Reasoner v2" },
  },
  {
    role: "user",
    content: "Compare the LD and warranty terms with the QatarEnergy NFE-2231 tender we won last quarter.",
  },
  {
    role: "ai",
    blocks: [
      {
        type: "text",
        content:
          "Side-by-side comparison of the two tenders on the four commercial clauses that drove the most negotiation effort on NFE-2231:",
      },
      {
        type: "table",
        head: ["Clause", "ADNOC PMP-2025-0421", "QatarEnergy NFE-2231 (won)", "Delta"],
        rows: [
          ["LD rate", "0.5 %/week", "0.3 %/week", "+0.2 % stiffer"],
          ["LD cap", "7.5 %", "5 %", "+2.5 % stiffer"],
          ["Warranty", "18 mo commissioning / 24 mo despatch", "24 mo commissioning / 30 mo despatch", "Shorter, vendor-favourable"],
          ["Performance bond", "10 % / 24 mo", "10 % / 18 mo", "+6 mo lock-up"],
          ["Bid validity", "120 days", "90 days", "+30 days drift exposure"],
        ],
      },
      {
        type: "callout",
        tone: "success",
        title: "Negotiation precedent",
        content:
          "On NFE-2231 we successfully reduced the LD cap from 7 % to 5 % by trading a 60-day extension on the FAT milestone. The same playbook applies here — Engineering has confirmed FAT can absorb a 30-day buffer without affecting site readiness.",
      },
    ],
    sources: [
      { doc: "ADNOC-PMP-2025-0421.pdf", page: 84, section: "§14.1" },
      { doc: "QE-NFE-2231-Awarded.pdf", page: 67, section: "§11 Commercial" },
      { doc: "Negotiation-Log-NFE2231.docx", page: 4, section: "LD trade-off" },
    ],
    meta: { tokens: 612, latency: "1.8s", model: "PumpIQ-Reasoner v2" },
  },
];

const roles = [
  { id: "Engineering", desc: "Technical depth, materials, hydraulics" },
  { id: "Sales", desc: "Commercial terms, margin, win strategy" },
  { id: "Management", desc: "Risk, schedule, executive summary" },
];

const suggestions = [
  "Summarise the technical scope in 5 bullets",
  "Draft clarification questions for §14.1",
  "List every deviation from API 610 12th Ed",
  "Compare LD penalties to NFE-2231",
  "What materials are mandated for sour service?",
  "Generate a 2-slide bid-committee briefing",
];

function Block({ b }: { b: Section }) {
  if (b.type === "heading") return <h4 className="font-semibold text-foreground mt-4 mb-2">{b.content}</h4>;
  if (b.type === "text")
    return (
      <p
        className="leading-relaxed"
        dangerouslySetInnerHTML={{ __html: b.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
      />
    );
  if (b.type === "list")
    return (
      <ul className="space-y-2 list-none pl-0">
        {b.items.map((it, i) => (
          <li key={i} className="flex gap-2.5">
            <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <span
              className="leading-relaxed"
              dangerouslySetInnerHTML={{ __html: it.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
            />
          </li>
        ))}
      </ul>
    );
  if (b.type === "table")
    return (
      <div className="rounded-lg border overflow-hidden bg-card my-2">
        <table className="w-full text-xs">
          <thead className="bg-muted/60 text-muted-foreground uppercase tracking-wider text-[10px]">
            <tr>
              {b.head.map((h, i) => (
                <th key={i} className="px-3 py-2 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.rows.map((r, i) => (
              <tr key={i} className="border-t">
                {r.map((c, j) => (
                  <td key={j} className="px-3 py-2">{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  if (b.type === "callout") {
    const tones = {
      info: "border-primary/40 bg-primary/5",
      warn: "border-warning/50 bg-warning/10",
      success: "border-success/50 bg-success/10",
    };
    return (
      <div className={`rounded-lg border-l-4 p-4 my-2 ${tones[b.tone]}`}>
        <p className="font-semibold text-sm mb-1">{b.title}</p>
        <p className="text-sm leading-relaxed text-foreground/85">{b.content}</p>
      </div>
    );
  }
  return null;
}

function Assistant() {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState(initial);
  const [role, setRole] = useState("Sales");

  const send = () => {
    if (!input.trim()) return;
    setMsgs([...msgs, { role: "user", content: input }]);
    setInput("");
  };

  return (
    <ModuleShell
      eyebrow="Module 04 · Conversational AI"
      title="PumpIQ Assistant"
      description="Ask anything about the active tender. The assistant reasons across datasheets, annexures, and historical bids — with full source traceability."
      subnav={chatSubnav}
    >
      <div className="grid lg:grid-cols-[280px_1fr_320px] gap-6 min-h-[calc(100vh-16rem)]">
        {/* LEFT — sessions & role */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">Role view</h4>
              <div className="space-y-1.5">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${
                      r.id === role
                        ? "bg-gradient-primary text-primary-foreground shadow-md"
                        : "hover:bg-muted/60"
                    }`}
                  >
                    <p className="text-sm font-medium">{r.id}</p>
                    <p className={`text-[11px] ${r.id === role ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      {r.desc}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">Recent sessions</h4>
              <div className="space-y-1 text-sm">
                {[
                  { t: "ADNOC PMP-2025-0421 · risk readout", a: "Active", live: true },
                  { t: "Saudi Aramco BB-2025-118 · clauses", a: "2h ago" },
                  { t: "QatarEnergy NFE-2231 · post-mortem", a: "Yesterday" },
                  { t: "Equinor Johan-Sverdrup spec", a: "3 days ago" },
                ].map((s, i) => (
                  <button
                    key={i}
                    className={`w-full text-left px-3 py-2 rounded-md hover:bg-muted/60 transition-colors ${
                      s.live ? "bg-primary/5 border border-primary/20" : ""
                    }`}
                  >
                    <p className="font-medium truncate text-[13px]">{s.t}</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                      {s.live && <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />}
                      {s.a}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">Knowledge sources</h4>
              <div className="space-y-2 text-xs">
                {[
                  { i: BookOpen, l: "Active tender corpus", v: "214 pages · 6 docs" },
                  { i: Database, l: "Historical bids", v: "1,284 indexed" },
                  { i: Layers, l: "Standards library", v: "API · ISO · NACE" },
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <s.i className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium">{s.l}</p>
                      <p className="text-muted-foreground text-[11px]">{s.v}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CENTER — chat */}
        <Card className="flex flex-col overflow-hidden">
          <div className="px-6 py-3 border-b bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">PumpIQ Assistant</p>
                <p className="text-[11px] text-muted-foreground">{role} view · grounded on ADNOC-PMP-2025-0421</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-success/10 text-success">● Online</Badge>
          </div>

          <CardContent className="p-6 flex-1 overflow-y-auto space-y-8">
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "ai" && (
                  <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0 shadow-glow">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div className={`${m.role === "user" ? "max-w-[75%]" : "max-w-[95%] flex-1"}`}>
                  {m.content && (
                    <div
                      className={`rounded-2xl px-5 py-3 text-sm ${
                        m.role === "user"
                          ? "bg-gradient-primary text-primary-foreground shadow-md"
                          : "bg-muted/40 border"
                      }`}
                    >
                      {m.content}
                    </div>
                  )}
                  {m.blocks && (
                    <div className="rounded-2xl border bg-card px-5 py-4 text-sm space-y-3 shadow-sm">
                      {m.blocks.map((b, j) => (
                        <Block key={j} b={b} />
                      ))}
                    </div>
                  )}
                  {m.sources && (
                    <div className="mt-3 space-y-1.5">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Sources cited</p>
                      <div className="flex flex-wrap gap-1.5">
                        {m.sources.map((s, j) => (
                          <button
                            key={j}
                            className="text-[11px] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/5 border border-primary/15 hover:bg-primary/10 transition-colors"
                          >
                            <FileText className="h-3 w-3 text-primary" />
                            <span className="font-medium truncate max-w-[180px]">{s.doc}</span>
                            <span className="text-primary">· {s.section} · p.{s.page}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {m.meta && (
                    <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span>{m.meta.model}</span>
                      <span>·</span>
                      <span>{m.meta.tokens} tokens</span>
                      <span>·</span>
                      <span>{m.meta.latency}</span>
                      <div className="ml-auto flex items-center gap-0.5">
                        <Button variant="ghost" size="icon" className="h-6 w-6"><Copy className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6"><ThumbsUp className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6"><ThumbsDown className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6"><RotateCcw className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  )}
                </div>
                {m.role === "user" && (
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </CardContent>

          <div className="p-4 border-t bg-muted/20">
            <div className="flex gap-1.5 mb-3 flex-wrap">
              {suggestions.map((s) => (
                <Badge
                  key={s}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-[11px]"
                  onClick={() => setInput(s)}
                >
                  <Sparkles className="h-3 w-3 mr-1" /> {s}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 items-center bg-background border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-primary/30 transition">
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={`Ask PumpIQ as ${role}…  (try: "draft a clarification email")`}
                className="border-0 shadow-none focus-visible:ring-0 px-1 flex-1"
              />
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <Mic className="h-4 w-4" />
              </Button>
              <Button onClick={send} className="bg-gradient-primary h-9 px-4 shrink-0">
                <Send className="h-4 w-4 mr-1" /> Send
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              Responses are grounded in indexed tender content. Always verify quoted clauses against the source PDF.
            </p>
          </div>
        </Card>

        {/* RIGHT — context */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">Active context</h4>
              <div className="text-xs space-y-2">
                {[
                  { f: "ADNOC-PMP-2025-0421.pdf", p: "214 pages · primary", on: true },
                  { f: "Datasheet-Annexure-A.xlsx", p: "12 sheets", on: true },
                  { f: "Compliance-Annexure-B.pdf", p: "47 pages", on: true },
                  { f: "QE-NFE-2231-Awarded.pdf", p: "ref · won bid", on: false },
                ].map((d, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 p-2.5 rounded-md border ${
                      d.on ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-transparent"
                    }`}
                  >
                    <FileText className={`h-3.5 w-3.5 shrink-0 ${d.on ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate text-[12px]">{d.f}</p>
                      <p className="text-[10px] text-muted-foreground">{d.p}</p>
                    </div>
                    <div className={`h-1.5 w-1.5 rounded-full ${d.on ? "bg-success" : "bg-muted-foreground/30"}`} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">Conversation insights</h4>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1"><span className="text-muted-foreground">Risks identified</span><span className="font-semibold text-warning">3 high</span></div>
                  <div className="flex justify-between mb-1"><span className="text-muted-foreground">Clauses referenced</span><span className="font-semibold">11</span></div>
                  <div className="flex justify-between mb-1"><span className="text-muted-foreground">Cross-doc citations</span><span className="font-semibold">7</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Avg confidence</span><span className="font-semibold text-success">94%</span></div>
                </div>
                <div className="pt-3 border-t">
                  <p className="font-semibold mb-2">Topics in this session</p>
                  <div className="flex flex-wrap gap-1">
                    {["LD penalties", "NPSH margin", "Duplex SS", "API 682", "Bond duration", "FAT schedule", "EAC cert"].map((t) => (
                      <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">Quick actions</h4>
              <div className="space-y-1.5">
                {[
                  "Export this thread as PDF",
                  "Send to Engineering review",
                  "Create clarification request",
                  "Save as bid template",
                ].map((a) => (
                  <button
                    key={a}
                    className="w-full text-left text-[12px] px-3 py-2 rounded-md hover:bg-muted/60 transition-colors flex items-center justify-between group"
                  >
                    <span>{a}</span>
                    <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleShell>
  );
}
