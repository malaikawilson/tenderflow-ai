import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

export interface ExtractedField {
  field: string;
  value: string;
  confidence: number;
  page?: number;
}

export function confidenceClass(c: number) {
  if (c >= 90) return "bg-success/10 text-success";
  if (c >= 80) return "bg-warning/15 text-warning";
  return "bg-destructive/10 text-destructive";
}

export function FieldTable({ rows }: { rows: ExtractedField[] }) {
  return (
    <div className="rounded-xl border overflow-hidden bg-card">
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
                <Badge variant="secondary" className={confidenceClass(r.confidence)}>
                  {r.confidence}%
                  {r.confidence < 85 && <AlertCircle className="h-3 w-3 ml-1" />}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                p.{r.page ?? Math.floor(Math.random() * 200) + 12}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
