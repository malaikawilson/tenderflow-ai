import { Link } from "@tanstack/react-router";

export const ingestionSubnav = [
  { to: "/ingestion/upload", label: "File Upload & Management" },
  { to: "/ingestion/ocr", label: "OCR & Parsing" },
];

export const extractionSubnav = [
  { to: "/extraction/technical", label: "Technical Data" },
  { to: "/extraction/commercial", label: "Commercial Data" },
  { to: "/extraction/confidence", label: "Confidence Scoring" },
];

export const clausesSubnav = [
  { to: "/clauses/identification", label: "Clause Identification" },
  { to: "/clauses/classification", label: "Clause Classification" },
];

export const chatSubnav = [
  { to: "/chat/assistant", label: "Chatbot Interface" },
  { to: "/chat/query", label: "Document Querying" },
  { to: "/chat/summarize", label: "Summarization" },
];

export const reportingSubnav = [
  { to: "/reporting/summary", label: "Tender Summary" },
  { to: "/reporting/discrepancy", label: "Discrepancy Report" },
  { to: "/reporting/export", label: "Export Formats" },
];

export const usersSubnav = [
  { to: "/users/team", label: "Team & Roles" },
  { to: "/users/security", label: "Authentication & Security" },
];

// re-export Link to avoid unused import warnings if needed
export { Link };
