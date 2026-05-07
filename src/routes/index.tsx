import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  FileUp,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Search,
  Droplets,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkspace } from "@/lib/workspace";
import { tenderLabelFromFileName } from "@/lib/simulation";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const seedDashboardRows = [
  {
    tender: "ADNOC-PMP-2025-0421",
    client: "ADNOC Onshore",
    owner: "Aarav Mehta",
    status: "Done",
    clauseType: "Commercial",
    confidence: 96,
    pages: 184,
  },
  {
    tender: "Saudi Aramco LSTK-9912",
    client: "Saudi Aramco",
    owner: "Priya Iyer",
    status: "In process",
    clauseType: "Technical",
    confidence: 78,
    pages: 412,
  },
  {
    tender: "ONGC Mumbai High-3318",
    client: "ONGC",
    owner: "Rahul Kapoor",
    status: "Done",
    clauseType: "Legal",
    confidence: 88,
    pages: 96,
  },
  {
    tender: "QatarEnergy NFE-2231",
    client: "QatarEnergy",
    owner: "Sara Khan",
    status: "In process",
    clauseType: "Commercial",
    confidence: 83,
    pages: 268,
  },
];

function avgConfidence(fields: { confidence: number }[]) {
  if (!fields.length) return 92;
  return Math.round(fields.reduce((a, b) => a + b.confidence, 0) / fields.length);
}

function Dashboard() {
  const fileRef = useRef<HTMLInputElement>(null);
  const { uploads, technicalFields, addFilesFromDashboard } = useWorkspace();
  const [query, setQuery] = useState("");

  const userRows = useMemo(
    () =>
      uploads
        .filter((u) => u.done)
        .map((u) => ({
          tender: tenderLabelFromFileName(u.name),
          client: "Your workspace",
          owner: "You",
          status: "Done",
          clauseType: "Extracted",
          confidence: avgConfidence(technicalFields),
          pages: 96 + (u.name.length % 340),
        })),
    [uploads, technicalFields],
  );

  const tableRows = useMemo(() => {
    const seen = new Set(userRows.map((r) => r.tender));
    const rest = seedDashboardRows.filter((r) => !seen.has(r.tender));
    return [...userRows, ...rest];
  }, [userRows]);

  const heroLive = useMemo(() => {
    const m = Object.fromEntries(technicalFields.map((x) => [x.field, x])) as Record<
      string,
      { value: string; confidence: number }
    >;
    return [
      {
        k: "Capacity",
        v: m["Flow Rate (Capacity)"]?.value ?? "850 m³/h",
        c: m["Flow Rate (Capacity)"]?.confidence ?? 98,
      },
      {
        k: "Total Head",
        v: m["Total Differential Head"]?.value ?? "245 m",
        c: m["Total Differential Head"]?.confidence ?? 96,
      },
      {
        k: "Material (Casing)",
        v: m["Casing Material"]?.value ?? "Duplex SS A890",
        c: m["Casing Material"]?.confidence ?? 92,
      },
      {
        k: "Standard",
        v: m["Applicable Standard"]?.value ?? "API 610 12th Ed.",
        c: m["Applicable Standard"]?.confidence ?? 99,
      },
      {
        k: "Motor Rating",
        v:
          m["Power (Rated)"] && m["Voltage"]
            ? `${m["Power (Rated)"].value} / ${m["Voltage"].value}`
            : "1250 kW / 11kV",
        c: m["Power (Rated)"]?.confidence ?? 87,
      },
      { k: "NPSHr", v: m["NPSHr"]?.value ?? "4.8 m", c: m["NPSHr"]?.confidence ?? 81 },
    ];
  }, [technicalFields]);

  const filteredRows = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return tableRows;
    return tableRows.filter((row) =>
      [row.tender, row.client, row.owner, row.status, row.clauseType]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [query, tableRows]);

  const onDashFiles = (list: FileList | null) => {
    if (!list?.length) return;
    addFilesFromDashboard(list);
  };

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
                Turn 400-page tenders into <span className="text-gradient">structured data</span> in
                minutes.
              </h1>
              <p className="text-muted-foreground text-lg mb-6 max-w-xl">
                AI-powered extraction of pump specifications, commercial terms, and contractual
                clauses — with confidence scores and discrepancy flags built-in.
              </p>
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                multiple
                accept=".pdf,.doc,.docx,.xlsx,.xls,.png,.jpg,.jpeg,.tiff"
                onChange={(e) => onDashFiles(e.target.files)}
              />
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-gradient-primary shadow-glow">
                  <Link to="/upload">
                    <FileUp className="h-4 w-4" />
                    Upload Tender
                  </Link>
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="secondary"
                  onClick={() => fileRef.current?.click()}
                >
                  <FileUp className="h-4 w-4" />
                  Quick upload
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
                  {heroLive.map((row) => (
                    <div
                      key={row.k}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
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

        <Card className="border mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <CardTitle className="text-base">Extracted Tenders</CardTitle>
              <div className="relative w-full md:w-80">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search tender, client, owner..."
                  className="pl-9"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-sm">
                <thead>
                  <tr className="border-b bg-muted/30 text-muted-foreground">
                    <th className="text-left font-medium px-4 py-3">Tender</th>
                    <th className="text-left font-medium px-4 py-3">Client</th>
                    <th className="text-left font-medium px-4 py-3">Owner</th>
                    <th className="text-left font-medium px-4 py-3">Status</th>
                    <th className="text-left font-medium px-4 py-3">Clause Type</th>
                    <th className="text-left font-medium px-4 py-3">Confidence</th>
                    <th className="text-left font-medium px-4 py-3">Pages</th>
                    <th className="text-left font-medium px-4 py-3 w-12" />
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr key={row.tender} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium">{row.tender}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.client}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.owner}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className={
                            row.status === "Done"
                              ? "bg-success/10 text-success"
                              : "bg-primary/10 text-primary"
                          }
                        >
                          {row.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="bg-accent text-accent-foreground">
                          {row.clauseType}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">{row.confidence}%</td>
                      <td className="px-4 py-3">{row.pages}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredRows.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground border-t">
                No tenders match your search.
              </div>
            )}
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-t bg-card">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-8 w-8 rounded-md bg-primary/10 text-primary font-medium flex items-center justify-center">
                  1
                </span>
                <span>2</span>
                <span>3</span>
                <span>...</span>
                <span>10</span>
              </div>
              <Button variant="outline" size="sm">
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
