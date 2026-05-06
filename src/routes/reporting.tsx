import { createFileRoute } from "@tanstack/react-router";
import { Download, FileSpreadsheet, FileText, FileJson, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/reporting")({
  component: Reporting,
});

const summary = [
  { section: "Pump Specifications", fields: 42, complete: 39, conf: 94 },
  { section: "Materials", fields: 18, complete: 17, conf: 91 },
  { section: "Motor & Driver", fields: 14, complete: 14, conf: 96 },
  { section: "Commercial Terms", fields: 22, complete: 19, conf: 87 },
  { section: "Legal Clauses", fields: 31, complete: 28, conf: 89 },
  { section: "Annexures", fields: 57, complete: 49, conf: 82 },
];

const discrepancies = [
  { type: "missing", field: "API 682 Seal Plan", section: "Annexure-B §4.2", severity: "high" },
  { type: "mismatch", field: "Flow rate: 850 m³/h vs 920 m³/h (datasheet)", section: "Page 47 vs Annexure-A", severity: "high" },
  { type: "low_conf", field: "Operating Temperature range", section: "Clause 7.3", severity: "medium" },
  { type: "missing", field: "Vibration limits (ISO 10816)", section: "Technical specs", severity: "medium" },
  { type: "mismatch", field: "Warranty: 18m vs 24m", section: "Clause 18 vs §3", severity: "low" },
];

function Reporting() {
  return (
    <div className="px-4 md:px-8 py-8 max-w-[1600px] mx-auto">
      <PageHeader
        eyebrow="Module 05"
        title="Reporting"
        description="Consolidated tender summary, discrepancy reports, and one-click exports to Excel, PDF, or JSON for downstream systems."
        actions={
          <>
            <Button variant="outline">
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4" /> PDF
            </Button>
            <Button>
              <Download className="h-4 w-4" /> Export All
            </Button>
          </>
        }
      />

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { l: "Overall Quality", v: "92%", icon: CheckCircle2, c: "text-success" },
          { l: "Completeness", v: "166 / 184", c: "text-primary" },
          { l: "Discrepancies", v: "11", icon: AlertTriangle, c: "text-warning" },
          { l: "Critical Missing", v: "3", icon: XCircle, c: "text-destructive" },
        ].map((s) => (
          <Card key={s.l}>
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground">{s.l}</p>
              <p className={`text-2xl font-bold mt-1 ${s.c}`}>{s.v}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="summary">
            <TabsList>
              <TabsTrigger value="summary">Tender Summary</TabsTrigger>
              <TabsTrigger value="discrepancy">Discrepancy Report</TabsTrigger>
              <TabsTrigger value="export">Export Formats</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-6 space-y-4">
              {summary.map((s) => (
                <div key={s.section} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{s.section}</h4>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground">
                        {s.complete}/{s.fields} fields
                      </span>
                      <Badge
                        variant="secondary"
                        className={s.conf >= 90 ? "bg-success/10 text-success" : "bg-warning/15 text-warning"}
                      >
                        {s.conf}% conf.
                      </Badge>
                    </div>
                  </div>
                  <Progress value={(s.complete / s.fields) * 100} className="h-2" />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="discrepancy" className="mt-6 space-y-3">
              {discrepancies.map((d, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                      d.severity === "high"
                        ? "bg-destructive/10 text-destructive"
                        : d.severity === "medium"
                        ? "bg-warning/15 text-warning"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{d.field}</p>
                    <p className="text-xs text-muted-foreground">{d.section}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      d.type === "missing"
                        ? "bg-destructive/10 text-destructive"
                        : d.type === "mismatch"
                        ? "bg-warning/15 text-warning"
                        : "bg-muted-foreground/10"
                    }
                  >
                    {d.type.replace("_", " ")}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    Resolve →
                  </Button>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="export" className="mt-6">
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { fmt: "Excel Datasheet", desc: "Editable template with all extracted fields", icon: FileSpreadsheet, color: "from-emerald-500 to-green-600" },
                  { fmt: "PDF Report", desc: "Non-editable consolidated tender report", icon: FileText, color: "from-rose-500 to-red-600" },
                  { fmt: "JSON / CSV", desc: "Structured data for ERP / analytics", icon: FileJson, color: "from-blue-500 to-indigo-600" },
                ].map((e) => (
                  <Card key={e.fmt} className="hover:shadow-elegant transition-shadow">
                    <CardContent className="p-6">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${e.color} flex items-center justify-center mb-4 shadow-md`}>
                        <e.icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold mb-1">{e.fmt}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{e.desc}</p>
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4" /> Download
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
