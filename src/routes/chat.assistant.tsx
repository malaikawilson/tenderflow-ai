import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Sparkles, FileText, User, Bot } from "lucide-react";
import { ModuleShell } from "@/components/ModuleShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { chatSubnav } from "@/lib/subnavs";

export const Route = createFileRoute("/chat/assistant")({
  component: Assistant,
});

type Msg = { role: "user" | "ai"; content: string; sources?: { doc: string; page: number; section: string }[] };

const initial: Msg[] = [
  { role: "user", content: "What is the delivery timeline for ADNOC tender?" },
  {
    role: "ai",
    content:
      "Delivery is **26 weeks ex-works** from LOI date. FAT is at week 22; site delivery (DDP Jebel Ali) at week 26. LD of 0.5%/week (max 7.5%) applies for delays.",
    sources: [
      { doc: "ADNOC-PMP-2025-0421.pdf", page: 84, section: "Clause 14.1" },
      { doc: "ADNOC-PMP-2025-0421.pdf", page: 92, section: "Annexure-D" },
    ],
  },
  { role: "user", content: "Summarise this for the Sales lead." },
  {
    role: "ai",
    content:
      "**Sales view** — 26-week schedule is tight but feasible with our standard BB3 platform. LD exposure capped at 7.5% ($1.4M on $19M deal). Recommend negotiating to 5% cap before bid submission.",
  },
];

const roles = ["Engineering", "Sales", "Management"];

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
      title="Chatbot Interface"
      description="Natural language Q&A over tender documents with multi-turn dialog and role-based responses for engineering, sales, and management."
      subnav={chatSubnav}
    >
      <div className="grid lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 flex flex-col h-[calc(100vh-22rem)] min-h-[500px]">
          <CardContent className="p-6 flex-1 overflow-y-auto space-y-6">
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "ai" && (
                  <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0 shadow-glow">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div className={`max-w-[80%] ${m.role === "user" ? "order-first" : ""}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm ${
                      m.role === "user"
                        ? "bg-gradient-primary text-primary-foreground shadow-md"
                        : "bg-muted/50 border"
                    }`}
                  >
                    <p
                      dangerouslySetInnerHTML={{
                        __html: m.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                      }}
                    />
                  </div>
                  {m.sources && (
                    <div className="mt-2 space-y-1">
                      {m.sources.map((s, j) => (
                        <div key={j} className="text-xs text-muted-foreground flex items-center gap-1.5 px-2">
                          <FileText className="h-3 w-3" />
                          <span className="truncate">{s.doc}</span>
                          <span className="text-primary">· {s.section} · p.{s.page}</span>
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
              {["Summarise tech scope", "List material requirements", "Compare to QatarEnergy NFE-2231", "What are the LD penalties?"].map((s) => (
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
                placeholder={`Ask anything as ${role}…`}
                className="flex-1"
              />
              <Button onClick={send} className="bg-gradient-primary">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <h4 className="font-semibold text-sm mb-3">Role View</h4>
              <div className="space-y-1.5">
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
                      r === role ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <h4 className="font-semibold text-sm mb-3">Active Context</h4>
              <div className="text-xs space-y-2">
                <div className="flex items-center gap-2 p-2 rounded-md bg-primary/5 border border-primary/20">
                  <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">ADNOC-PMP-2025-0421.pdf</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-md bg-muted/40">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">Datasheet-Annexure-A.xlsx</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleShell>
  );
}
