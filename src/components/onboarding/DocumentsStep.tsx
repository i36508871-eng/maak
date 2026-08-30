import { useState } from "react";
import { Check, FileText, Loader2, Trash2, Upload } from "lucide-react";
import {
  DOC_TYPES,
  deleteDocument,
  uploadDocument,
  type DocType,
  type ProviderDocumentRow,
} from "../../lib/onboarding";

export default function DocumentsStep({
  userId,
  documents,
  onDocumentsChange,
}: {
  userId: string;
  documents: ProviderDocumentRow[];
  onDocumentsChange: (docs: ProviderDocumentRow[]) => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(docType: DocType, file: File | null) {
    if (!file) return;
    setError(null);
    setBusy(docType);
    try {
      const existing = documents.find((d) => d.document_type === docType);
      if (existing) await deleteDocument(existing);
      const created = await uploadDocument(userId, docType, file);
      onDocumentsChange(documents.filter((d) => d.document_type !== docType).concat(created));
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر رفع الوثيقة");
    } finally {
      setBusy(null);
    }
  }

  async function handleRemove(doc: ProviderDocumentRow) {
    setError(null);
    setBusy(doc.document_type);
    try {
      await deleteDocument(doc);
      onDocumentsChange(documents.filter((d) => d.id !== doc.id));
    } catch {
      setError("تعذّر حذف الوثيقة");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="onb-step-card">
      <h2 className="onb-step-title">الوثائق المطلوبة</h2>
      <p className="onb-step-sub">وثائقك محفوظة بسرية تامة وما يقدر يشوفها غيرك نتي.</p>
      {error ? <div className="onb-error">{error}</div> : null}
      <div className="onb-docs">
        {(Object.keys(DOC_TYPES) as DocType[]).map((dt) => {
          const cfg = DOC_TYPES[dt];
          const doc = documents.find((d) => d.document_type === dt);
          const isBusy = busy === dt;
          return (
            <div key={dt} className="onb-doc">
              <div className="onb-doc-head">
                <span className="onb-doc-label">{cfg.label}{cfg.required ? " *" : ""}</span>
                {doc ? <span className="onb-doc-ok"><Check size={13} /> تم الرفع</span> : null}
              </div>
              {doc ? (
                <div className="onb-doc-done">
                  <span className="onb-doc-file"><FileText size={15} /> {doc.storage_path.split("/").pop()}</span>
                  <button className="mini-button" type="button" disabled={isBusy} onClick={() => handleRemove(doc)}>
                    {isBusy ? <Loader2 className="auth-spin" size={14} /> : <Trash2 size={14} />}
                    <span>حذف</span>
                  </button>
                </div>
              ) : (
                <label className={"onb-upload" + (isBusy ? " busy" : "")}>
                  <input type="file" accept={cfg.accept} disabled={isBusy} onChange={(e) => handleFile(dt, e.target.files?.[0] ?? null)} />
                  {isBusy ? <Loader2 className="auth-spin" size={18} /> : <Upload size={18} />}
                  <span>اختر ملف (PDF / JPG / PNG — أقصى 5 ميغا)</span>
                </label>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
