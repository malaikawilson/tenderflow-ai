import type { ExtractedField } from "@/components/FieldTable";

export type PreviewRow = {
  parameter: string;
  value: string;
  confidence: string;
  section: "Technical" | "Commercial";
  sourcePage: string;
};

function previewField(
  parameter: string,
  value: string,
  primary: ExtractedField | undefined,
  section: "Technical" | "Commercial",
): PreviewRow {
  return {
    parameter,
    value,
    confidence: primary ? `${primary.confidence}%` : "—",
    section,
    sourcePage: primary?.page != null ? `p.${primary.page}` : "—",
  };
}

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: number, i: number): T {
  return arr[(seed + i * 17) % arr.length];
}

export function tenderLabelFromFileName(name: string): string {
  const base = name.replace(/\.[^.]+$/, "").trim();
  if (!base) return "TENDER-UPLOAD";
  return base.replace(/\s+/g, "-").slice(0, 48).toUpperCase();
}

export function simulateTechnicalFields(fileName: string): ExtractedField[] {
  const seed = hashSeed(fileName);
  const flows = ["720 m³/h", "850 m³/h", "920 m³/h", "1050 m³/h"];
  const heads = ["210 m", "245 m", "268 m", "290 m"];
  const eff = ["76.2 %", "78.5 %", "81.0 %", "83.4 %"];
  const npsh = ["4.2 m", "4.8 m", "5.1 m", "5.6 m"];
  const mats = [
    "Duplex SS ASTM A890 Gr. 4A",
    "Super duplex UNS S32760",
    "Carbon steel + SS trim",
    "Ni-Al-Bronze impeller",
  ];
  const construct = [
    "Horizontal Centrifugal, BB3",
    "Between-bearings multistage",
    "OH2 vertical inline",
    "BB5 double casing",
  ];
  const standards = [
    "API 610 12th Ed., ISO 13709",
    "API 610 11th Ed., IEC equivalent",
    "API 610 + customer spec addendum",
    "ISO 5199, API 682 Plan 53B",
  ];
  const power = ["980 kW", "1250 kW", "1450 kW", "1600 kW"];
  const voltage = ["6.6 kV", "11 kV", "13.8 kV", "415 V"];
  const freq = ["50 Hz", "60 Hz"];
  const drivers = [
    "TEFC Induction Motor (IE3)",
    "2-pole induction, Zone 2",
    "VFD-ready TEFC motor",
    "Steam turbine driver (optional)",
  ];

  const pageBase = 40 + (seed % 12);
  const pumpCount = 3 + (seed % 8);

  const buildPumpRows = (pumpNumber: number): ExtractedField[] => {
    const pumpSeed = seed + pumpNumber * 31;
    const prefix = pumpNumber === 1 ? "" : `Pump ${pumpNumber} - `;
    const pageShift = (pumpNumber - 1) * 7;
    const confidencePenalty = Math.min(10, (pumpNumber - 1) * 2);

    return [
      {
        field: `${prefix}Pump Type`,
        value: pick(construct, pumpSeed, 0),
        confidence: Math.max(70, 95 + (pumpSeed % 4) - confidencePenalty),
        page: pageBase + pageShift,
      },
      {
        field: `${prefix}Flow Rate (Capacity)`,
        value: pick(flows, pumpSeed, 1),
        confidence: Math.max(70, 96 + (pumpSeed % 3) - confidencePenalty),
        page: pageBase + pageShift + 1,
      },
      {
        field: `${prefix}Total Differential Head`,
        value: pick(heads, pumpSeed, 2),
        confidence: Math.max(70, 94 + (pumpSeed % 4) - confidencePenalty),
        page: pageBase + pageShift + 1,
      },
      {
        field: `${prefix}Efficiency (BEP)`,
        value: pick(eff, pumpSeed, 3),
        confidence: Math.max(70, 84 + (pumpSeed % 6) - confidencePenalty),
        page: pageBase + pageShift + 2,
      },
      {
        field: `${prefix}NPSHr`,
        value: pick(npsh, pumpSeed, 4),
        confidence: Math.max(68, 78 + (pumpSeed % 8) - confidencePenalty),
        page: pageBase + pageShift + 2,
      },
      {
        field: `${prefix}Casing Material`,
        value: pick(mats, pumpSeed, 5),
        confidence: Math.max(70, 90 + (pumpSeed % 5) - confidencePenalty),
        page: pageBase + pageShift + 3,
      },
      {
        field: `${prefix}Impeller Material`,
        value: pick(mats, pumpSeed, 6),
        confidence: Math.max(70, 88 + (pumpSeed % 6) - confidencePenalty),
        page: pageBase + pageShift + 3,
      },
      {
        field: `${prefix}Shaft Material`,
        value: pick(
          ["Duplex SS UNS S31803", "17-4 PH SS", "AISI 431 + HVOF coating", "Super duplex UNS S32750"],
          pumpSeed,
          7,
        ),
        confidence: Math.max(70, 87 + (pumpSeed % 5) - confidencePenalty),
        page: pageBase + pageShift + 3,
      },
      {
        field: `${prefix}Applicable Standard`,
        value: pick(standards, pumpSeed, 8),
        confidence: Math.max(72, 97 + (pumpSeed % 2) - confidencePenalty),
        page: pageBase + pageShift,
      },
      {
        field: `${prefix}Secondary Standard`,
        value: pick(
          [
            "ISO 13709 / API 682 Plan 53B",
            "API 682 Plan 52 / ISO 21049",
            "ISO 9906 Grade 2B test tolerance",
            "API 614 auxiliary systems reference",
          ],
          pumpSeed,
          9,
        ),
        confidence: Math.max(70, 91 + (pumpSeed % 4) - confidencePenalty),
        page: pageBase + pageShift + 4,
      },
      {
        field: `${prefix}Power (Rated)`,
        value: pick(power, pumpSeed, 10),
        confidence: Math.max(70, 93 + (pumpSeed % 5) - confidencePenalty),
        page: pageBase + pageShift + 5,
      },
      {
        field: `${prefix}Voltage`,
        value: pick(voltage, pumpSeed, 11),
        confidence: Math.max(72, 95 + (pumpSeed % 4) - confidencePenalty),
        page: pageBase + pageShift + 5,
      },
      {
        field: `${prefix}Frequency`,
        value: pick(freq, pumpSeed, 12),
        confidence: Math.max(72, 97 + (pumpSeed % 2) - confidencePenalty),
        page: pageBase + pageShift + 5,
      },
      {
        field: `${prefix}Driver Type`,
        value: pick(drivers, pumpSeed, 13),
        confidence: Math.max(68, 85 + (pumpSeed % 8) - confidencePenalty),
        page: pageBase + pageShift + 5,
      },
      {
        field: `${prefix}Operating Temperature`,
        value: pick(["-10°C to 180°C", "-20°C to 160°C", "0°C to 150°C", "-5°C to 200°C"], pumpSeed, 14),
        confidence: Math.max(65, 74 + (pumpSeed % 10) - confidencePenalty),
        page: pageBase + pageShift + 6,
      },
      {
        field: `${prefix}Design Pressure`,
        value: `${52 + (pumpSeed % 19)} bar(g)`,
        confidence: Math.max(70, 88 + (pumpSeed % 6) - confidencePenalty),
        page: pageBase + pageShift + 6,
      },
    ];
  };

  return Array.from({ length: pumpCount }, (_, idx) => buildPumpRows(idx + 1)).flat();
}

export function simulateCommercialFields(fileName: string): ExtractedField[] {
  const seed = hashSeed(fileName + "c");
  const pay = [
    "30% advance, 60% on delivery, 10% after PG",
    "20% LOI, 50% shipment, 30% commissioning",
    "Net 45 from invoice",
  ];
  const del = ["24 weeks ex-works", "26 weeks ex-works", "30 weeks ex-works"];
  const loc = ["DDP Jebel Ali, UAE", "FOB Singapore", "CIF Mumbai"];
  return [
    { field: "Payment Terms", value: pick(pay, seed, 0), confidence: 92 + (seed % 5), page: 86 },
    {
      field: "Delivery Schedule",
      value: pick(del, seed, 1),
      confidence: 90 + (seed % 6),
      page: 88,
    },
    {
      field: "Delivery Location",
      value: pick(loc, seed, 2),
      confidence: 86 + (seed % 8),
      page: 88,
    },
    {
      field: "Warranty / Guarantee",
      value: "18 months from commissioning / 24 from despatch",
      confidence: 88 + (seed % 6),
      page: 102,
    },
    {
      field: "Performance Bond",
      value: "10% of contract value, valid 24 months",
      confidence: 86 + (seed % 7),
      page: 90,
    },
    {
      field: "Liquidated Damages (LD)",
      value: "0.5% per week, max 7.5%",
      confidence: 94 + (seed % 4),
      page: 84,
    },
    {
      field: "Penalty Clause",
      value: "Additional 2% for missed FAT milestones",
      confidence: 77 + (seed % 8),
      page: 85,
    },
    {
      field: "Compliance Standards",
      value: "NACE MR0175, ASME B73.1, IEC 60079",
      confidence: 89 + (seed % 6),
      page: 12,
    },
    {
      field: "Regulatory Approvals",
      value: "ATEX Zone 2, IECEx, EAC",
      confidence: 84 + (seed % 8),
      page: 14,
    },
    { field: "Currency", value: "USD", confidence: 98, page: 9 },
    {
      field: "Validity Period",
      value: "120 days from bid submission",
      confidence: 76 + (seed % 10),
      page: 7,
    },
    {
      field: "Insurance Requirements",
      value: "Marine + 110% replacement cover",
      confidence: 80 + (seed % 8),
      page: 95,
    },
  ];
}

export function technicalToPreviewRows(fields: ExtractedField[]): PreviewRow[] {
  const byField = Object.fromEntries(fields.map((f) => [f.field, f])) as Record<
    string,
    ExtractedField
  >;

  const flow = byField["Flow Rate (Capacity)"]?.value ?? "850 m³/h";
  const head = byField["Total Differential Head"]?.value ?? "245 m";
  const eff = byField["Efficiency (BEP)"]?.value ?? "78.5 %";
  const npsh = byField["NPSHr"]?.value ?? "4.8 m";
  const mat = byField["Casing Material"]?.value ?? "Duplex SS ASTM A890 Gr. 4A";
  const construct = byField["Pump Type"]?.value ?? "Horizontal Centrifugal, BB3";
  const std = byField["Applicable Standard"]?.value ?? "API 610 12th Ed., ISO 13709";
  const power = byField["Power (Rated)"]?.value ?? "1250 kW";
  const voltage = byField["Voltage"]?.value ?? "11 kV";
  const frequency = byField["Frequency"]?.value ?? "50 Hz";
  const driver = byField["Driver Type"]?.value ?? "TEFC Induction Motor (IE3)";

  return [
    previewField("Flow", flow, byField["Flow Rate (Capacity)"], "Technical"),
    previewField("Head", head, byField["Total Differential Head"], "Technical"),
    previewField("Efficiency", eff, byField["Efficiency (BEP)"], "Technical"),
    previewField("NPSH (Net Positive Suction Head)", npsh, byField["NPSHr"], "Technical"),
    previewField(
      "Material of Construction",
      `${mat}; ${construct}`,
      byField["Casing Material"] ?? byField["Pump Type"],
      "Technical",
    ),
    previewField(
      "Applicable Standards (API, ISO, etc.)",
      std,
      byField["Applicable Standard"],
      "Technical",
    ),
    previewField("Power", power, byField["Power (Rated)"], "Technical"),
    previewField("Voltage", voltage, byField["Voltage"], "Technical"),
    previewField("Frequency", frequency, byField["Frequency"], "Technical"),
    previewField("Driver Type", driver, byField["Driver Type"], "Technical"),
    previewField(
      "Operating temperature",
      byField["Operating Temperature"]?.value ?? "—",
      byField["Operating Temperature"],
      "Technical",
    ),
    previewField(
      "Design pressure",
      byField["Design Pressure"]?.value ?? "—",
      byField["Design Pressure"],
      "Technical",
    ),
  ];
}

export function commercialToPreviewRows(fields: ExtractedField[]): PreviewRow[] {
  const byField = Object.fromEntries(fields.map((f) => [f.field, f])) as Record<
    string,
    ExtractedField
  >;
  const schedule = byField["Delivery Schedule"];
  const loc = byField["Delivery Location"];
  const deliveryVal =
    schedule || loc
      ? [schedule?.value, loc?.value].filter(Boolean).join(" · ")
      : "—";

  return [
    previewField("Payment Terms", byField["Payment Terms"]?.value ?? "—", byField["Payment Terms"], "Commercial"),
    previewField("Delivery", deliveryVal, schedule ?? loc, "Commercial"),
    previewField(
      "Warranty / Guarantee",
      byField["Warranty / Guarantee"]?.value ?? "—",
      byField["Warranty / Guarantee"],
      "Commercial",
    ),
    previewField(
      "Performance bond",
      byField["Performance Bond"]?.value ?? "—",
      byField["Performance Bond"],
      "Commercial",
    ),
    previewField(
      "Liquidated damages (LD)",
      byField["Liquidated Damages (LD)"]?.value ?? "—",
      byField["Liquidated Damages (LD)"],
      "Commercial",
    ),
    previewField(
      "Penalty clause",
      byField["Penalty Clause"]?.value ?? "—",
      byField["Penalty Clause"],
      "Commercial",
    ),
    previewField(
      "Compliance standards",
      byField["Compliance Standards"]?.value ?? "—",
      byField["Compliance Standards"],
      "Commercial",
    ),
    previewField(
      "Regulatory approvals",
      byField["Regulatory Approvals"]?.value ?? "—",
      byField["Regulatory Approvals"],
      "Commercial",
    ),
    previewField("Currency", byField["Currency"]?.value ?? "—", byField["Currency"], "Commercial"),
    previewField(
      "Validity period",
      byField["Validity Period"]?.value ?? "—",
      byField["Validity Period"],
      "Commercial",
    ),
    previewField(
      "Insurance requirements",
      byField["Insurance Requirements"]?.value ?? "—",
      byField["Insurance Requirements"],
      "Commercial",
    ),
  ];
}

export function buildExportPreviewRows(
  technical: ExtractedField[],
  commercial: ExtractedField[],
): PreviewRow[] {
  return [...technicalToPreviewRows(technical), ...commercialToPreviewRows(commercial)];
}

export function buildScanSnippet(technical: ExtractedField[], fileLabel: string): string {
  const map = Object.fromEntries(technical.map((t) => [t.field, t.value])) as Record<
    string,
    string
  >;
  return [
    `Document: ${fileLabel}`,
    "",
    "SECTION 6.2 — Pump technical requirements (extract)",
    `Rated capacity: ${map["Flow Rate (Capacity)"] ?? "—"}`,
    `Total differential head: ${map["Total Differential Head"] ?? "—"}`,
    `Pump configuration: ${map["Pump Type"] ?? "—"}`,
    `Efficiency at BEP: ${map["Efficiency (BEP)"] ?? "—"}`,
    `NPSHr: ${map["NPSHr"] ?? "—"}`,
    `Materials — casing / impeller: ${map["Casing Material"] ?? "—"} / ${map["Impeller Material"] ?? "—"}`,
    `Standards: ${map["Applicable Standard"] ?? "—"}`,
    `Motor: ${map["Power (Rated)"] ?? "—"} @ ${map["Voltage"] ?? "—"}, ${map["Frequency"] ?? "—"}`,
    `Driver: ${map["Driver Type"] ?? "—"}`,
  ].join("\n");
}

export function buildCommercialScanSnippet(
  commercial: ExtractedField[],
  fileLabel: string,
): string {
  const c = Object.fromEntries(commercial.map((x) => [x.field, x.value])) as Record<string, string>;
  return [
    `Document: ${fileLabel}`,
    "",
    "SECTION 9 — Commercial terms (extract)",
    `Payment: ${c["Payment Terms"] ?? "—"}`,
    `Delivery: ${c["Delivery Schedule"] ?? "—"} · ${c["Delivery Location"] ?? "—"}`,
    `LD: ${c["Liquidated Damages (LD)"] ?? "—"}`,
    `Warranty: ${c["Warranty / Guarantee"] ?? "—"}`,
    `Performance bond: ${c["Performance Bond"] ?? "—"}`,
    `Validity: ${c["Validity Period"] ?? "—"}`,
  ].join("\n");
}

const tbl =
  'class="w-full text-xs border-collapse border border-border rounded-md overflow-hidden my-3"';
const th = 'class="border border-border bg-muted/60 px-2 py-1.5 text-left font-semibold"';
const td = 'class="border border-border px-2 py-1.5 align-top"';
const tdMuted = 'class="border border-border px-2 py-1.5 align-top text-muted-foreground"';

export function buildChatReply(
  message: string,
  tenderId: string,
  technical: ExtractedField[],
  commercial: ExtractedField[],
): string {
  const m = message.toLowerCase();
  const t = Object.fromEntries(technical.map((x) => [x.field, x.value])) as Record<string, string>;
  const c = Object.fromEntries(commercial.map((x) => [x.field, x.value])) as Record<string, string>;

  const cite = (field: string, section: string) =>
    `For **${tenderId}**, extracted **${field}** is **${t[section] ?? "not found in the current extraction run"}** (simulated extraction).`;

  if (/delivery|schedule|timeline|weeks|fat/.test(m)) {
    return `<p><strong>${tenderId}</strong> — commercial / logistics snapshot (simulated extraction):</p>
<table ${tbl}><thead><tr><th ${th}>Area</th><th ${th}>Extracted value</th></tr></thead><tbody>
<tr><td ${td}>Delivery schedule</td><td ${td}>${c["Delivery Schedule"] ?? "—"}</td></tr>
<tr><td ${td}>Delivery location</td><td ${td}>${c["Delivery Location"] ?? "—"}</td></tr>
<tr><td ${td}>Validity</td><td ${td}>${c["Validity Period"] ?? "—"}</td></tr>
<tr><td ${td}>Insurance</td><td ${td}>${c["Insurance Requirements"] ?? "—"}</td></tr>
</tbody></table>
<p class="text-xs text-muted-foreground">Cross-check FAT milestones and site readiness against Annex-D in the source pack.</p>`;
  }
  if (/ld|liquidated|penalt/.test(m)) {
    return `<p><strong>${tenderId}</strong> — risk / penalty clauses (simulated):</p>
<table ${tbl}><thead><tr><th ${th}>Clause</th><th ${th}>Wording (extracted)</th></tr></thead><tbody>
<tr><td ${td}>Liquidated damages</td><td ${td}>${c["Liquidated Damages (LD)"] ?? "—"}</td></tr>
<tr><td ${td}>Additional penalties</td><td ${td}>${c["Penalty Clause"] ?? "—"}</td></tr>
<tr><td ${td}>Performance bond</td><td ${td}>${c["Performance Bond"] ?? "—"}</td></tr>
</tbody></table>`;
  }
  if (/payment|advance|retention/.test(m)) {
    return `<p><strong>${tenderId}</strong> — payment &amp; commercial terms (simulated):</p>
<table ${tbl}><thead><tr><th ${th}>Item</th><th ${th}>Detail</th></tr></thead><tbody>
<tr><td ${td}>Payment terms</td><td ${td}>${c["Payment Terms"] ?? "—"}</td></tr>
<tr><td ${td}>Currency</td><td ${td}>${c["Currency"] ?? "—"}</td></tr>
<tr><td ${td}>Warranty</td><td ${td}>${c["Warranty / Guarantee"] ?? "—"}</td></tr>
</tbody></table>`;
  }
  if (/warrant/.test(m)) {
    return `<p>Warranty for <strong>${tenderId}</strong>:</p>
<table ${tbl}><tbody>
<tr><td ${tdMuted}>Warranty / guarantee</td><td ${td}>${c["Warranty / Guarantee"] ?? "—"}</td></tr>
</tbody></table>`;
  }
  if (/summaris.*(flow|head|npsh|duty)|flow.*head.*npsh|duty point/.test(m)) {
    return `<p><strong>${tenderId}</strong> — hydraulic duty point (simulated extraction):</p>
<table ${tbl}><thead><tr><th ${th}>Parameter</th><th ${th}>Value</th><th ${th}>Notes</th></tr></thead><tbody>
<tr><td ${td}>Flow (capacity)</td><td ${td}>${t["Flow Rate (Capacity)"] ?? "—"}</td><td ${tdMuted}>BEP-rated</td></tr>
<tr><td ${td}>Head (TDH)</td><td ${td}>${t["Total Differential Head"] ?? "—"}</td><td ${tdMuted}>Rated condition</td></tr>
<tr><td ${td}>NPSHr</td><td ${td}>${t["NPSHr"] ?? "—"}</td><td ${tdMuted}>At rated speed</td></tr>
<tr><td ${td}>Efficiency @ BEP</td><td ${td}>${t["Efficiency (BEP)"] ?? "—"}</td><td ${tdMuted}>Minimum per ITT</td></tr>
</tbody></table>`;
  }
  if (/flow|capacity|rate|m³|m3/.test(m)) {
    return cite("flow", "Flow Rate (Capacity)");
  }
  if (/head|tdh|differential/.test(m)) {
    return cite("head", "Total Differential Head");
  }
  if (/npsh/.test(m)) {
    return cite("NPSHr", "NPSHr");
  }
  if (/efficien/.test(m)) {
    return cite("efficiency", "Efficiency (BEP)");
  }
  if (/material|duplex|ss|bronze/.test(m)) {
    return `<p><strong>${tenderId}</strong> — wetted parts &amp; construction (simulated):</p>
<table ${tbl}><thead><tr><th ${th}>Component</th><th ${th}>Material / type</th></tr></thead><tbody>
<tr><td ${td}>Casing</td><td ${td}>${t["Casing Material"] ?? "—"}</td></tr>
<tr><td ${td}>Impeller</td><td ${td}>${t["Impeller Material"] ?? "—"}</td></tr>
<tr><td ${td}>Shaft</td><td ${td}>${t["Shaft Material"] ?? "—"}</td></tr>
<tr><td ${td}>Pump configuration</td><td ${td}>${t["Pump Type"] ?? "—"}</td></tr>
</tbody></table>`;
  }
  if (/api|iso|standard/.test(m)) {
    return cite("standards", "Applicable Standard");
  }
  if (/power|motor|kw|voltage|hz|frequency|driver/.test(m)) {
    return `<p><strong>${tenderId}</strong> — electrical &amp; driver package (simulated):</p>
<table ${tbl}><thead><tr><th ${th}>Parameter</th><th ${th}>Value</th></tr></thead><tbody>
<tr><td ${td}>Rated power</td><td ${td}>${t["Power (Rated)"] ?? "—"}</td></tr>
<tr><td ${td}>Voltage</td><td ${td}>${t["Voltage"] ?? "—"}</td></tr>
<tr><td ${td}>Frequency</td><td ${td}>${t["Frequency"] ?? "—"}</td></tr>
<tr><td ${td}>Driver type</td><td ${td}>${t["Driver Type"] ?? "—"}</td></tr>
</tbody></table>`;
  }
  if (/hello|hi\b|hey/.test(m)) {
    return `Hi — context: <strong>${tenderId}</strong>. Try <strong>delivery</strong>, <strong>LDs</strong>, <strong>payment</strong>, or a <strong>duty summary</strong> (say: “Summarise flow, head, and NPSHr”).`;
  }
  return `<p>Context: <strong>${tenderId}</strong> (simulated extraction).</p>
<table ${tbl}><thead><tr><th ${th}>Try asking</th><th ${th}>Example</th></tr></thead><tbody>
<tr><td ${td}>Hydraulics</td><td ${tdMuted}>“Summarise flow, head, and NPSHr”</td></tr>
<tr><td ${td}>Commercial</td><td ${tdMuted}>“What are the LD penalties?” / “Payment terms?”</td></tr>
<tr><td ${td}>Electrical</td><td ${tdMuted}>“Motor voltage and driver type?”</td></tr>
</tbody></table>`;
}

export function buildChatReplyAll(
  message: string,
  tenderIds: string[],
  workspaceTenderLabel: string | null,
): string {
  const m = message.toLowerCase();
  const ids = [...new Set(tenderIds)];
  const rows = ids.map((id) => {
    const tech = simulateTechnicalFields(`${id}.pdf`);
    const com = simulateCommercialFields(`${id}.pdf`);
    const tf = Object.fromEntries(tech.map((x) => [x.field, x.value])) as Record<string, string>;
    const cf = Object.fromEntries(com.map((x) => [x.field, x.value])) as Record<string, string>;
    const mark = workspaceTenderLabel === id ? " ★" : "";
    return `<tr><td ${td}><strong>${id}</strong>${mark}</td><td ${td}>${tf["Flow Rate (Capacity)"] ?? "—"}</td><td ${td}>${tf["Total Differential Head"] ?? "—"}</td><td ${td}>${tf["NPSHr"] ?? "—"}</td><td ${td}>${cf["Delivery Schedule"] ?? "—"}</td><td ${td}>${cf["Liquidated Damages (LD)"] ?? "—"}</td></tr>`;
  });

  if (/hello|hi\b|hey/.test(m)) {
    return `<p><strong>ALL tenders</strong> mode — comparing <strong>${ids.length}</strong> reference packages (simulated). ★ marks your last workspace extraction.</p>
<table ${tbl}><thead><tr><th ${th}>Tender</th><th ${th}>Flow</th><th ${th}>Head</th><th ${th}>NPSHr</th><th ${th}>Delivery</th><th ${th}>LD summary</th></tr></thead><tbody>
${rows.join("")}
</tbody></table>`;
  }

  return `<p><strong>ALL tenders</strong> — snapshot across library (simulated). Ask about delivery, LDs, or hydraulics for a side-by-side view.</p>
<table ${tbl}><thead><tr><th ${th}>Tender</th><th ${th}>Flow</th><th ${th}>Head</th><th ${th}>NPSHr</th><th ${th}>Delivery</th><th ${th}>LD</th></tr></thead><tbody>
${rows.join("")}
</tbody></table>
<p class="text-xs text-muted-foreground">Select a single tender for deeper clause-level answers.</p>`;
}
