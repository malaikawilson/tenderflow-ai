import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileUp,
  Sparkles,
  FileSearch,
  MessageSquare,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Droplets,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const stats = [
  { label: "Tenders Processed", value: "248", delta: "+12%", icon: FileUp },
  { label: "Avg. Confidence", value: "94.2%", delta: "+2.1%", icon: TrendingUp },
  { label: "Clauses Extracted", value: "5,392", delta: "+318", icon: FileSearch },
  { label: "Pending Review", value: "17", delta: "-4", icon: AlertTriangle },
];

const recentTenders = [
  { name: "ADNOC-PMP-2025-0421", client: "ADNOC Onshore", status: "Extracted", confidence: 96, pages: 184 },
  { name: "Saudi Aramco LSTK-9912", client: "Saudi Aramco", status: "Processing", confidence: 78, pages: 412 },
  { name: "ONGC Mumbai High-3318", client: "ONGC", status: "Review", confidence: 71, pages: 96 },
  { name: "QatarEnergy NFE-2231", client: "QatarEnergy", status: "Extracted", confidence: 92, pages: 268 },
];

const modules = [
  { title: "Document Ingestion", desc: "Upload PDFs, Word, Excel & scanned files", icon: FileUp, url: "/ingestion", color: "from-blue-500 to-blue-700" },
  { title: "AI Data Extraction", desc: "Pump specs, materials, standards, motors", icon: Sparkles, url: "/extraction", color: "from-cyan-500 to-blue-600" },
  { title: "Clause Extraction", desc: "Payment, warranty, LD & penalty clauses", icon: FileSearch, url: "/clauses", color: "from-indigo-500 to-blue-700" },
  { title: "Conversational AI", desc: "Ask anything about the tender", icon: MessageSquare, url: "/chat", color: "from-sky-500 to-blue-600" },
  { title: "Reporting", desc: "Summary, discrepancy & exports", icon: BarChart3, url: "/reporting", color: "from-blue-600 to-indigo-700" },
];

function Dashboard() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="relative px-4 md:px-8 py-8 max-w-[1600px] mx-auto">
        {/* Hero */}
        <div className="rounded-3xl border bg-card/80 backdrop-blur-sm shadow-elegant overflow-hidden mb-8 relative">
          <div className="absolute inset-0 grid-bg opacity-50" />
          <div className="relative p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/15 border-0 mb-4">
                <Droplets className="h-3 w-3 mr-1.5" /> Oil & Gas Pump Intelligence
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Turn 400-page tenders into{" "}
                <span className="text-gradient">structured data</span> in minutes.
              </h1>
              <p className="text-muted-foreground text-lg mb-6 max-w-xl">
                AI-powered extraction of pump specifications, commercial terms, and contractual
                clauses — with confidence scores and discrepancy flags built-in.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-gradient-primary shadow-glow">
                  <Link to="/ingestion">
                    <FileUp className="h-4 w-4" />
                    Upload Tender
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/chat">
                    <MessageSquare className="h-4 w-4" />
                    Ask the AI
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-end">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 bg-gradient-primary rounded-full blur-3xl opacity-20" />
                <div className="relative h-full w-full rounded-2xl border bg-card/80 backdrop-blur p-6 shadow-elegant">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-muted-foreground">Live Extraction</span>
                    <span className="flex items-center gap-1.5 text-xs text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Active
                    </span>
                  </div>
                  {[
                    { k: "Capacity", v: "850 m³/h", c: 98 },
                    { k: "Total Head", v: "245 m", c: 96 },
                    { k: "Material (Casing)", v: "Duplex SS A890", c: 92 },
                    { k: "Standard", v: "API 610 12th Ed.", c: 99 },
                    { k: "Motor Rating", v: "1250 kW / 11kV", c: 87 },
                    { k: "NPSHr", v: "4.8 m", c: 81 },
                  ].map((row) => (
                    <div key={row.k} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="text-xs text-muted-foreground">{row.k}</p>
                        <p className="text-sm font-medium">{row.v}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          row.c >= 90
                            ? "bg-success/10 text-success"
                            : row.c >= 80
                            ? "bg-warning/15 text-warning"
                            : "bg-destructive/10 text-destructive"
                        }
                      >
                        {row.c}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <Card key={s.label} className="border bg-card/80 backdrop-blur-sm hover:shadow-elegant transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <s.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-success">{s.delta}</span>
                </div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modules grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Modules</h2>
              <span className="text-xs text-muted-foreground">6 active</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {modules.map((m) => (
                <Link key={m.title} to={m.url} className="group">
                  <Card className="h-full border hover:border-primary/40 transition-all hover:shadow-elegant">
                    <CardContent className="p-5">
                      <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${m.color} flex items-center justify-center mb-4 shadow-md`}>
                        <m.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold mb-1">{m.title}</h3>
                          <p className="text-sm text-muted-foreground">{m.desc}</p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent tenders */}
          <Card className="border">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                Recent Tenders
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTenders.map((t) => (
                <div key={t.name} className="pb-4 border-b last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{t.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.client} · {t.pages} pages
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        t.status === "Extracted"
                          ? "bg-success/10 text-success"
                          : t.status === "Processing"
                          ? "bg-primary/10 text-primary"
                          : "bg-warning/15 text-warning"
                      }
                    >
                      {t.status === "Extracted" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {t.status}
                    </Badge>
                  </div>
                  <Progress value={t.confidence} className="h-1.5" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Confidence {t.confidence}%
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
