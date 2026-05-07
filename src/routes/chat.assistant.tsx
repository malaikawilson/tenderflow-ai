import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Send, Sparkles, FileText, User, Bot, ChevronDown } from "lucide-react";
import { ModuleShell } from "@/components/ModuleShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { chatSubnav } from "@/lib/subnavs";
import {
  buildChatReply,
  buildChatReplyAll,
  simulateCommercialFields,
  simulateTechnicalFields,
} from "@/lib/simulation";
import { useWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/chat/assistant")({
  component: Assistant,
});

type Msg = {
  role: "user" | "ai";
  content: string;
  sources?: { doc: string; page: number; section: string }[];
};

const CTX_ALL = "__ALL__";
const CTX_NONE = "__NONE__";

const demoTenders = [
  "ADNOC-PMP-2025-0421",
  "Saudi Aramco LSTK-9912",
  "ONGC Mumbai High-3318",
  "QatarEnergy NFE-2231",
];

function renderAiHtml(raw: string) {
  return raw.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

function Assistant() {
  const ws = useWorkspace();
  const tenderOptions = useMemo(() => {
    const next = new Set(demoTenders);
    if (ws.tenderLabel) next.add(ws.tenderLabel);
    return Array.from(next);
  }, [ws.tenderLabel]);

  const allScopeIds = useMemo(
    () => [...new Set([...demoTenders, ...(ws.tenderLabel ? [ws.tenderLabel] : [])])],
    [ws.tenderLabel],
  );

  const [selectedTender, setSelectedTender] = useState(demoTenders[0]);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "ai",
      content:
        "Use **Active context** to choose **ALL** (compare every reference tender), **NONE** (no document grounding), or one tender. Answers can include **tables** for duty, commercial, and electrical topics.",
    },
  ]);

  useEffect(() => {
    if (selectedTender === CTX_ALL || selectedTender === CTX_NONE) return;
    if (ws.tenderLabel && !tenderOptions.includes(selectedTender)) {
      setSelectedTender(ws.tenderLabel);
    }
  }, [ws.tenderLabel, tenderOptions, selectedTender]);

  const resolveFields = () => {
    const tech =
      selectedTender === ws.tenderLabel
        ? ws.technicalFields
        : simulateTechnicalFields(`${selectedTender}.pdf`);
    const com =
      selectedTender === ws.tenderLabel
        ? ws.commercialFields
        : simulateCommercialFields(`${selectedTender}.pdf`);
    return { tech, com };
  };

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMsgs((m) => [...m, { role: "user", content: userMsg }]);
    setInput("");
    window.setTimeout(() => {
      if (selectedTender === CTX_NONE) {
        setMsgs((m) => [
          ...m,
          {
            role: "ai",
            content:
              "**No document scope** is active. Select **ALL** to compare tenders, or pick a **specific tender** so I can ground answers in simulated extraction data.",
          },
        ]);
        return;
      }

      let reply: string;
      if (selectedTender === CTX_ALL) {
        reply = buildChatReplyAll(userMsg, allScopeIds, ws.tenderLabel);
      } else {
        const { tech, com } = resolveFields();
        reply = buildChatReply(userMsg, selectedTender, tech, com);
      }

      const docName =
        selectedTender === CTX_ALL
          ? "Multiple (library)"
          : (ws.activeFileName ?? `${selectedTender}.pdf`);

      setMsgs((m) => [
        ...m,
        {
          role: "ai",
          content: reply,
          sources: [
            {
              doc: docName,
              page: 47,
              section:
                selectedTender === CTX_ALL
                  ? "Cross-tender (simulated)"
                  : "Technical / Commercial (simulated)",
            },
          ],
        },
      ]);
    }, 420);
  };

  return (
    <ModuleShell
      eyebrow="Module 04 · Conversational AI"
      title="Chatbot Interface"
      description="Natural language Q&A over tender documents with multi-turn dialog and role-based responses for engineering, sales, and management."
      subnav={chatSubnav}
    >
      <div className="grid lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 flex flex-col h-[calc(100vh-16rem)] min-h-[640px]">
          <CardContent className="p-6 flex-1 overflow-y-auto space-y-6">
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "ai" && (
                  <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0 shadow-glow">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`min-w-0 ${
                    m.role === "user" ? "max-w-[80%] order-first" : "max-w-[min(96%,56rem)] w-full"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm ${
                      m.role === "user"
                        ? "bg-gradient-primary text-primary-foreground shadow-md"
                        : "bg-muted/50 border"
                    }`}
                  >
                    {m.role === "ai" ? (
                      <div
                        className="overflow-x-auto [&_table]:text-xs [&_th]:whitespace-nowrap [&_td]:whitespace-normal"
                        dangerouslySetInnerHTML={{
                          __html: renderAiHtml(m.content),
                        }}
                      />
                    ) : (
                      <p>{m.content}</p>
                    )}
                  </div>
                  {m.sources && (
                    <div className="mt-2 space-y-1">
                      {m.sources.map((s, j) => (
                        <div
                          key={j}
                          className="text-xs text-muted-foreground flex items-center gap-1.5 px-2"
                        >
                          <FileText className="h-3 w-3" />
                          <span className="truncate">{s.doc}</span>
                          <span className="text-primary">
                            · {s.section} · p.{s.page}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {m.role === "user" && (
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
          <div className="p-4 border-t bg-muted/20">
            <div className="flex gap-2 mb-3 flex-wrap">
              {[
                "What is the delivery schedule?",
                "Summarise flow, head, and NPSHr",
                "What are the LD penalties?",
                "What payment terms apply?",
              ].map((s) => (
                <Badge
                  key={s}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => setInput(s)}
                >
                  <Sparkles className="h-3 w-3 mr-1" /> {s}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={
                  selectedTender === CTX_NONE
                    ? "Select ALL or a tender to ask document questions…"
                    : selectedTender === CTX_ALL
                      ? "Ask for a cross-tender comparison…"
                      : `Ask anything about ${selectedTender}…`
                }
                className="flex-1"
              />
              <Button type="button" onClick={send} className="bg-gradient-primary">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-4 h-[calc(100vh-16rem)] min-h-[640px]">
          <Card className="h-full">
            <CardContent className="p-5">
              <h4 className="font-semibold text-sm mb-3">Active Context</h4>
              <div className="relative mb-3">
                <select
                  value={selectedTender}
                  onChange={(e) => setSelectedTender(e.target.value)}
                  className="w-full h-9 rounded-md border bg-background px-3 pr-8 text-sm appearance-none"
                >
                  <option value={CTX_ALL}>ALL — all tenders (compare)</option>
                  <option value={CTX_NONE}>NONE — no document scope</option>
                  {tenderOptions.map((tender) => (
                    <option key={tender} value={tender}>
                      {tender}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-4 w-4 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <div className="text-xs space-y-2">
                {selectedTender === CTX_NONE && (
                  <p className="text-muted-foreground p-2 rounded-md border border-dashed">
                    No tender selected. The assistant will not use extraction data until you choose{" "}
                    <strong>ALL</strong> or a specific tender.
                  </p>
                )}
                {selectedTender === CTX_ALL && (
                  <p className="text-muted-foreground p-2 rounded-md bg-primary/5 border border-primary/15">
                    Scope: <strong>all</strong> library tenders ({allScopeIds.length} packages,
                    simulated).
                    {ws.tenderLabel ? (
                      <>
                        {" "}
                        Workspace focus: <strong>{ws.tenderLabel}</strong>.
                      </>
                    ) : null}
                  </p>
                )}
                {selectedTender !== CTX_NONE && selectedTender !== CTX_ALL && (
                  <>
                    <div className="flex items-center gap-2 p-2 rounded-md bg-primary/5 border border-primary/20">
                      <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate">{selectedTender}.pdf</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-md bg-muted/40">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate">Datasheet-Annexure-A.xlsx</span>
                    </div>
                  </>
                )}
                {ws.tenderLabel && selectedTender !== CTX_NONE && (
                  <p className="text-[11px] text-muted-foreground pt-1">
                    Latest workspace extraction: <strong>{ws.tenderLabel}</strong>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleShell>
  );
}
