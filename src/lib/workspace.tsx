import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ExtractedField } from "@/components/FieldTable";
import {
  buildScanSnippet,
  simulateCommercialFields,
  simulateTechnicalFields,
  tenderLabelFromFileName,
  type PreviewRow,
  buildExportPreviewRows,
} from "@/lib/simulation";

const STORAGE_KEY = "pumpiq.workspace.v1";

export type WorkspaceUpload = {
  id: string;
  name: string;
  sizeLabel: string;
  progress: number;
  status: string;
  done: boolean;
};

type PersistedState = {
  activeFileName: string | null;
  tenderLabel: string | null;
  uploads: WorkspaceUpload[];
  technicalFields: ExtractedField[];
  commercialFields: ExtractedField[];
  scanText: string;
};

type WorkspaceContextValue = PersistedState & {
  previewRows: PreviewRow[];
  addFilesFromDashboard: (files: FileList | File[]) => void;
  addFilesOnUploadPage: (files: FileList | File[]) => void;
  removeUpload: (id: string) => void;
  runProceedToExtraction: () => void;
  clearWorkspace: () => void;
};

const defaultDemoFile = "ADNOC-PMP-2025-0421.pdf";
const defaultTechnical = simulateTechnicalFields(defaultDemoFile);
const defaultCommercial = simulateCommercialFields(defaultDemoFile);

const defaultPersisted: PersistedState = {
  activeFileName: defaultDemoFile,
  tenderLabel: tenderLabelFromFileName(defaultDemoFile),
  uploads: [],
  technicalFields: defaultTechnical,
  commercialFields: defaultCommercial,
  scanText: buildScanSnippet(defaultTechnical, defaultDemoFile),
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function loadPersisted(): PersistedState {
  try {
    if (typeof window === "undefined") return defaultPersisted;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPersisted;
    const parsed = JSON.parse(raw) as PersistedState;
    if (!parsed.technicalFields?.length) return defaultPersisted;
    const merged = { ...defaultPersisted, ...parsed };
    const hasPumpPrefixes = merged.technicalFields.some((row) =>
      /^\s*(?:pump|p)\s*[-_#:]?\s*\d+/i.test(row.field),
    );
    if (!hasPumpPrefixes) {
      const fileName = merged.activeFileName ?? defaultDemoFile;
      const regeneratedTechnical = simulateTechnicalFields(fileName);
      const regeneratedCommercial = simulateCommercialFields(fileName);
      merged.technicalFields = regeneratedTechnical;
      merged.commercialFields = regeneratedCommercial;
      merged.scanText = buildScanSnippet(regeneratedTechnical, fileName);
    }
    if (!merged.scanText && merged.technicalFields.length) {
      merged.scanText = buildScanSnippet(
        merged.technicalFields,
        merged.activeFileName ?? "Tender.pdf",
      );
    }
    return merged;
  } catch {
    return defaultPersisted;
  }
}

function savePersisted(s: PersistedState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

function formatSize(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => loadPersisted());

  useEffect(() => {
    savePersisted(state);
  }, [state]);

  const applyExtractionForFile = useCallback((fileName: string) => {
    const technical = simulateTechnicalFields(fileName);
    const commercial = simulateCommercialFields(fileName);
    const scanText = buildScanSnippet(technical, fileName);
    const tenderLabel = tenderLabelFromFileName(fileName);
    setState((prev) => ({
      ...prev,
      activeFileName: fileName,
      tenderLabel,
      technicalFields: technical,
      commercialFields: commercial,
      scanText,
    }));
  }, []);

  const addFilesFromDashboard = useCallback(
    (fileList: FileList | File[]) => {
      const files = Array.from(fileList as FileList);
      if (!files.length) return;
      const now = Date.now();
      setState((prev) => {
        const nextUploads = [...prev.uploads];
        files.forEach((file, i) => {
          const id = `up-${now}-${i}`;
          nextUploads.unshift({
            id,
            name: file.name,
            sizeLabel: formatSize(file.size),
            progress: 0,
            status: "Queued…",
            done: false,
          });
        });
        return { ...prev, uploads: nextUploads };
      });
      files.forEach((file, i) => {
        const id = `up-${now}-${i}`;
        let p = 0;
        const tick = () => {
          p += 18 + Math.floor(Math.random() * 15);
          if (p >= 100) {
            setState((prev) => ({
              ...prev,
              uploads: prev.uploads.map((u) =>
                u.id === id
                  ? { ...u, progress: 100, status: "Stored — ready to extract", done: true }
                  : u,
              ),
            }));
            applyExtractionForFile(file.name);
            return;
          }
          setState((prev) => ({
            ...prev,
            uploads: prev.uploads.map((u) =>
              u.id === id ? { ...u, progress: p, status: "Uploading…" } : u,
            ),
          }));
          window.setTimeout(tick, 220);
        };
        window.setTimeout(tick, 200 + i * 120);
      });
    },
    [applyExtractionForFile],
  );

  const addFilesOnUploadPage = useCallback(
    (fileList: FileList | File[]) => {
      addFilesFromDashboard(fileList);
    },
    [addFilesFromDashboard],
  );

  const removeUpload = useCallback((id: string) => {
    setState((prev) => ({ ...prev, uploads: prev.uploads.filter((u) => u.id !== id) }));
  }, []);

  const runProceedToExtraction = useCallback(() => {
    const done = state.uploads.find((u) => u.done);
    if (done) applyExtractionForFile(done.name);
    else if (state.activeFileName) applyExtractionForFile(state.activeFileName);
    else applyExtractionForFile("Uploaded-Tender.pdf");
  }, [applyExtractionForFile, state.uploads, state.activeFileName]);

  const clearWorkspace = useCallback(() => {
    setState(defaultPersisted);
    savePersisted(defaultPersisted);
  }, []);

  const previewRows = useMemo(
    () => buildExportPreviewRows(state.technicalFields, state.commercialFields),
    [state.technicalFields, state.commercialFields],
  );

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      ...state,
      previewRows,
      addFilesFromDashboard,
      addFilesOnUploadPage,
      removeUpload,
      runProceedToExtraction,
      clearWorkspace,
    }),
    [
      state,
      previewRows,
      addFilesFromDashboard,
      addFilesOnUploadPage,
      removeUpload,
      runProceedToExtraction,
      clearWorkspace,
    ],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}
