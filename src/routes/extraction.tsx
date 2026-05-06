import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Download, Filter, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/extraction")({
  component: Extraction,
});

const technical = [
  { field: "Pump Type", value: "Horizontal Centrifugal, BB3", confidence: 98 },
  { field: "Flow Rate", value: "850 m³/h", confidence: 99 },
  { field: "Total Differential Head", value: "245 m", confidence: 96 },
  { field: "Efficiency (BEP)", value: "78.5 %", confidence: 88 },
  { field: "NPSHr", value: "4.8 m", confidence: 81 },
  { field: "Casing Material", value: "Duplex SS ASTM A890 Gr. 4A", confidence: 92 },
  { field: "Impeller Material", value: "Duplex SS A890 Gr. 5A", confidence: 90 },
  { field: "Standard", value: "API 610 12th Edition", confidence: 99 },
  { field: "Motor Rating", value: "1250 kW", confidence: 95 },
  { field: "Voltage / Frequency", value: "11 kV / 50 Hz", confidence: 94 },
  { field: "Driver Type", value: "TEFC Induction Motor (IE3)", confidence: 87 },
  { field: "Operating Temperature", value: "-10°C to 180°C", confidence: 76 },
];

const commercial = [
  { field: "Payment Terms", value: "30% advance, 60% on delivery, 10% after PG", confidence: 94 },
  { field: "Delivery Schedule", value: "26 weeks ex-works", confidence: 92 },
  { field: "Warranty", value: "18 months from commissioning / 24 from despatch", confidence: 90 },
  { field: "Liquidated Damages", value: "0.5% per week, max 7.5%", confidence: 96 },
  { field: "Performance Bond", value: "10% of contract value, valid 24 months", confidence: 88 },
  { field: "Inco Terms", value: "DDP Site (Jebel Ali)", confidence: 84 },
  { field: "Currency", value: "USD", confidence: 99 },
  { field: "Validity", value: "120 days from bid submission", confidence: 78 },
];

function badgeColor(c: number) {
  if (c >= 90) return "bg-success/10 text-success";
  if (c >= 80) return "bg-warning/15 text-warning";
  return "bg-destructive/10 text-destructive";
}

function FieldTable({ rows }: { rows: typeof technical }) {
  return (
    <div className="rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="text-left px-4 py-3 font-medium">Field</th>
            <th className="text-left px-4 py-3 font-medium">Extracted Value</th>
            <th className="text-right px-4 py-3 font-medium">Confidence</th>
            <th className="text-right px-4 py-3 font-medium">Source</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.field} className="border-t hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-medium">{r.field}</td>
              <td className="px-4 py-3 text-muted-foreground">{r.value}</td>
              <td className="px-4 py-3 text-right">
                <Badge variant="secondary" className={badgeColor(r.confidence)}>
                  {r.confidence}%
                  {r.confidence < 85 && <AlertCircle className="h-3 w-3 ml-1" />}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                p.{Math.floor(Math.random() * 200) + 12}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Extraction() {
  return (
    <div className="px-4 md:px-8 py-8 max-w-[1600px] mx-auto">
      <PageHeader
        eyebrow="Module 02"
        title="AI Data Extraction"
        description="Pump specifications and commercial fields automatically extracted with confidence scoring and source traceability."
        actions={
          <>
            <Button variant="outline">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button>
              <Download className="h-4 w-4" /> Export Datasheet
            </Button>
          </>
        }
      />

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { l: "Total Fields", v: "184", icon: Sparkles },
          { l: "High Confidence", v: "152", c: "text-success" },
          { l: "Needs Review", v: "23", c: "text-warning" },
          { l: "Missing", v: "9", c: "text-destructive" },
        ].map((s) => (
          <Card key={s.l}>
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground">{s.l}</p>
              <p className={`text-2xl font-bold mt-1 ${s.c ?? ""}`}>{s.v}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="technical">
            <TabsList>
              <TabsTrigger value="technical">Technical Specifications</TabsTrigger>
              <TabsTrigger value="commercial">Commercial Terms</TabsTrigger>
            </TabsList>
            <TabsContent value="technical" className="mt-6">
              <FieldTable rows={technical} />
            </TabsContent>
            <TabsContent value="commercial" className="mt-6">
              <FieldTable rows={commercial} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
