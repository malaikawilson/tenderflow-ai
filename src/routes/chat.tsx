import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Sparkles, FileText, User, Bot } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/chat")({
  component: Chat;
});

type Msg = { role: "user" | "ai"; content: string; sources?: { doc: string; page: number; section: string }[] };

const initialMessages: Msg[] = [
  { role: "user", content: "What is the delivery timeline for the ADNOC tender?" },
  {
    role: "ai",
    content:
      "Delivery is **26 weeks ex-works** from the date of LOI, with FAT scheduled at week 22 in Vendor's facility. Site delivery (DDP Jebel Ali) is week 26. Liquidated damages of 0.5%/week (max 7.5%) apply for delays.",
    sources: [
      { doc: "ADNOC-PMP-2025-0421.pdf", page: 84, section: "Clause 14.1" },
      { doc: "ADNOC-PMP-2025-0421.pdf", page: 92, section: "Annexure-D Schedule" },
    ],
  },
  { role: "user", content: "Are there any non-standard payment terms?" },
  {
    role: "ai",
    content:
      "Yes — **two deviations** from standard. (1) 10% retention against Performance Bond is held for 24 months post-commissioning (standard: 12 months). (2) Advance payment limited to 30% (standard: 40%). Recommend escalation to Commercial Manager.",
    sources: [{ doc: "ADNOC-PMP-2025-0421.pdf", page: 88, section: "Clause 9.3" }],
  },
];

const suggestions = [
  "Summarize the technical scope",
  "What is the NPSH margin requirement?",
  "List all material requirements",
  "Compare to QatarEnergy NFE-2231",
];

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);

  const send = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
  };

  return (
    <div className="px-4 md:px-8 py-8 max-w-[1600px] mx-auto">
      <PageHeader
        eyebrow="Module 04"
        title="Conversational AI"
        description="Ask anything about the tender. Multi-turn context, role-aware responses, and source-traced answers across documents and annexures."
      />

      <div className="grid lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 flex flex-col h-[calc(100vh-18rem)]">
          <CardContent className="p-6 flex-1 overflow-y-auto space-y-6">
            {messages.map((m, i) => (
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
                        <div
                          key={j}
                          className="text-xs text-muted-foreground flex items-center gap-1.5 px-2"
                        >
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
              {suggestions.map((s) => (
                <Badge
                  key={s}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => setInput(s)}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {s}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about specs, clauses, deviations…"
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

          <Card>
            <CardContent className="p-5">
              <h4 className="font-semibold text-sm mb-3">Role View</h4>
              <div className="space-y-1.5">
                {["Engineering", "Sales", "Management"].map((r, i) => (
                  <button
                    key={r}
                    className={`w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
                      i === 1 ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
