import { useEffect, useState } from "react";
import {
  AlertCircle, ArrowLeft, Ban, Check, Clock, ExternalLink, FileText, Loader2,
  ShieldCheck, X,
} from "lucide-react";
import { Logo } from "../components/atoms";
import { useAuth } from "../auth";
import { useToast } from "../context";
import * as admin from "../lib/admin";
import type { AdminApplication, AdminDocument } from "../lib/admin";
import type { VerificationStatus } from "../types";
import { useLanguage } from "../i18n";

const TABS = ["نظرة عامة", "التحقق من المقدّمين"] as const;
type Tab = (typeof TABS)[number];

type CountStatus = "pending" | "approved" | "rejected";

const STATUS_FILTERS: { key: CountStatus; label: string }[] = [
  { key: "pending", label: "قيد المراجعة" },
  { key: "approved", label: "مقبول" },
  { key: "rejected", label: "مرفوض" },
];

type TranslateFunc = (key: string, vars?: Record<string, string | number>) => string;

function statusBadge(status: VerificationStatus, t: TranslateFunc) {
 {t("adm.approved")} {t("adm.approved")}i{t("adm.approved")}f{t("adm.approved")} {t("adm.approved")}({t("adm.approved")}s{t("adm.approved")}t{t("adm.approved")}a{t("adm.approved")}t{t("adm.approved")}u{t("adm.approved")}s{t("adm.approved")} {t("adm.approved")}={t("adm.approved")}={t("adm.approved")}={t("adm.approved")} {t("adm.approved")}"{t("adm.approved")}a{t("adm.approved")}p{t("adm.approved")}p{t("adm.approved")}r{t("adm.approved")}o{t("adm.approved")}v{t("adm.approved")}e{t("adm.approved")}d{t("adm.approved")}"{t("adm.approved")}){t("adm.approved")} {t("adm.approved")}r{t("adm.approved")}e{t("adm.approved")}t{t("adm.approved")}u{t("adm.approved")}r{t("adm.approved")}n{t("adm.approved")} {t("adm.approved")}<{t("adm.approved")}s{t("adm.approved")}p{t("adm.approved")}a{t("adm.approved")}n{t("adm.approved")} {t("adm.approved")}c{t("adm.approved")}l{t("adm.approved")}a{t("adm.approved")}s{t("adm.approved")}s{t("adm.approved")}N{t("adm.approved")}a{t("adm.approved")}m{t("adm.approved")}e{t("adm.approved")}={t("adm.approved")}"{t("adm.approved")}v{t("adm.approved")}k{t("adm.approved")}-{t("adm.approved")}b{t("adm.approved")}a{t("adm.approved")}d{t("adm.approved")}g{t("adm.approved")}e{t("adm.approved")} {t("adm.approved")}o{t("adm.approved")}k{t("adm.approved")}"{t("adm.approved")}>{t("adm.approved")}<{t("adm.approved")}C{t("adm.approved")}h{t("adm.approved")}e{t("adm.approved")}c{t("adm.approved")}k{t("adm.approved")} {t("adm.approved")}s{t("adm.approved")}i{t("adm.approved")}z{t("adm.approved")}e{t("adm.approved")}={t("adm.approved")}{{t("adm.approved")}1{t("adm.approved")}1{t("adm.approved")}}{t("adm.approved")} {t("adm.approved")}/{t("adm.approved")}>{t("adm.approved")} {t("adm.approved")}م{t("adm.approved")}ق{t("adm.approved")}ب{t("adm.approved")}و{t("adm.approved")}ل{t("adm.approved")}<{t("adm.approved")}/{t("adm.approved")}s{t("adm.approved")}p{t("adm.approved")}a{t("adm.approved")}n{t("adm.approved")}>{t("adm.approved")};
 {t("adm.rejectedBadge")} {t("adm.rejectedBadge")}i{t("adm.rejectedBadge")}f{t("adm.rejectedBadge")} {t("adm.rejectedBadge")}({t("adm.rejectedBadge")}s{t("adm.rejectedBadge")}t{t("adm.rejectedBadge")}a{t("adm.rejectedBadge")}t{t("adm.rejectedBadge")}u{t("adm.rejectedBadge")}s{t("adm.rejectedBadge")} {t("adm.rejectedBadge")}={t("adm.rejectedBadge")}={t("adm.rejectedBadge")}={t("adm.rejectedBadge")} {t("adm.rejectedBadge")}"{t("adm.rejectedBadge")}r{t("adm.rejectedBadge")}e{t("adm.rejectedBadge")}j{t("adm.rejectedBadge")}e{t("adm.rejectedBadge")}c{t("adm.rejectedBadge")}t{t("adm.rejectedBadge")}e{t("adm.rejectedBadge")}d{t("adm.rejectedBadge")}"{t("adm.rejectedBadge")}){t("adm.rejectedBadge")} {t("adm.rejectedBadge")}r{t("adm.rejectedBadge")}e{t("adm.rejectedBadge")}t{t("adm.rejectedBadge")}u{t("adm.rejectedBadge")}r{t("adm.rejectedBadge")}n{t("adm.rejectedBadge")} {t("adm.rejectedBadge")}<{t("adm.rejectedBadge")}s{t("adm.rejectedBadge")}p{t("adm.rejectedBadge")}a{t("adm.rejectedBadge")}n{t("adm.rejectedBadge")} {t("adm.rejectedBadge")}c{t("adm.rejectedBadge")}l{t("adm.rejectedBadge")}a{t("adm.rejectedBadge")}s{t("adm.rejectedBadge")}s{t("adm.rejectedBadge")}N{t("adm.rejectedBadge")}a{t("adm.rejectedBadge")}m{t("adm.rejectedBadge")}e{t("adm.rejectedBadge")}={t("adm.rejectedBadge")}"{t("adm.rejectedBadge")}v{t("adm.rejectedBadge")}k{t("adm.rejectedBadge")}-{t("adm.rejectedBadge")}b{t("adm.rejectedBadge")}a{t("adm.rejectedBadge")}d{t("adm.rejectedBadge")}g{t("adm.rejectedBadge")}e{t("adm.rejectedBadge")} {t("adm.rejectedBadge")}n{t("adm.rejectedBadge")}o{t("adm.rejectedBadge")}"{t("adm.rejectedBadge")}>{t("adm.rejectedBadge")}<{t("adm.rejectedBadge")}X{t("adm.rejectedBadge")} {t("adm.rejectedBadge")}s{t("adm.rejectedBadge")}i{t("adm.rejectedBadge")}z{t("adm.rejectedBadge")}e{t("adm.rejectedBadge")}={t("adm.rejectedBadge")}{{t("adm.rejectedBadge")}1{t("adm.rejectedBadge")}1{t("adm.rejectedBadge")}}{t("adm.rejectedBadge")} {t("adm.rejectedBadge")}/{t("adm.rejectedBadge")}>{t("adm.rejectedBadge")} {t("adm.rejectedBadge")}م{t("adm.rejectedBadge")}ر{t("adm.rejectedBadge")}ف{t("adm.rejectedBadge")}و{t("adm.rejectedBadge")}ض{t("adm.rejectedBadge")}<{t("adm.rejectedBadge")}/{t("adm.rejectedBadge")}s{t("adm.rejectedBadge")}p{t("adm.rejectedBadge")}a{t("adm.rejectedBadge")}n{t("adm.rejectedBadge")}>{t("adm.rejectedBadge")};
 {t("adm.pendingReview")} {t("adm.pendingReview")}i{t("adm.pendingReview")}f{t("adm.pendingReview")} {t("adm.pendingReview")}({t("adm.pendingReview")}s{t("adm.pendingReview")}t{t("adm.pendingReview")}a{t("adm.pendingReview")}t{t("adm.pendingReview")}u{t("adm.pendingReview")}s{t("adm.pendingReview")} {t("adm.pendingReview")}={t("adm.pendingReview")}={t("adm.pendingReview")}={t("adm.pendingReview")} {t("adm.pendingReview")}"{t("adm.pendingReview")}p{t("adm.pendingReview")}e{t("adm.pendingReview")}n{t("adm.pendingReview")}d{t("adm.pendingReview")}i{t("adm.pendingReview")}n{t("adm.pendingReview")}g{t("adm.pendingReview")}"{t("adm.pendingReview")}){t("adm.pendingReview")} {t("adm.pendingReview")}r{t("adm.pendingReview")}e{t("adm.pendingReview")}t{t("adm.pendingReview")}u{t("adm.pendingReview")}r{t("adm.pendingReview")}n{t("adm.pendingReview")} {t("adm.pendingReview")}<{t("adm.pendingReview")}s{t("adm.pendingReview")}p{t("adm.pendingReview")}a{t("adm.pendingReview")}n{t("adm.pendingReview")} {t("adm.pendingReview")}c{t("adm.pendingReview")}l{t("adm.pendingReview")}a{t("adm.pendingReview")}s{t("adm.pendingReview")}s{t("adm.pendingReview")}N{t("adm.pendingReview")}a{t("adm.pendingReview")}m{t("adm.pendingReview")}e{t("adm.pendingReview")}={t("adm.pendingReview")}"{t("adm.pendingReview")}v{t("adm.pendingReview")}k{t("adm.pendingReview")}-{t("adm.pendingReview")}b{t("adm.pendingReview")}a{t("adm.pendingReview")}d{t("adm.pendingReview")}g{t("adm.pendingReview")}e{t("adm.pendingReview")} {t("adm.pendingReview")}w{t("adm.pendingReview")}a{t("adm.pendingReview")}i{t("adm.pendingReview")}t{t("adm.pendingReview")}"{t("adm.pendingReview")}>{t("adm.pendingReview")}<{t("adm.pendingReview")}C{t("adm.pendingReview")}l{t("adm.pendingReview")}o{t("adm.pendingReview")}c{t("adm.pendingReview")}k{t("adm.pendingReview")} {t("adm.pendingReview")}s{t("adm.pendingReview")}i{t("adm.pendingReview")}z{t("adm.pendingReview")}e{t("adm.pendingReview")}={t("adm.pendingReview")}{{t("adm.pendingReview")}1{t("adm.pendingReview")}1{t("adm.pendingReview")}}{t("adm.pendingReview")} {t("adm.pendingReview")}/{t("adm.pendingReview")}>{t("adm.pendingReview")} {t("adm.pendingReview")}ق{t("adm.pendingReview")}ي{t("adm.pendingReview")}د{t("adm.pendingReview")} {t("adm.pendingReview")}ا{t("adm.pendingReview")}ل{t("adm.pendingReview")}م{t("adm.pendingReview")}ر{t("adm.pendingReview")}ا{t("adm.pendingReview")}ج{t("adm.pendingReview")}ع{t("adm.pendingReview")}ة{t("adm.pendingReview")}<{t("adm.pendingReview")}/{t("adm.pendingReview")}s{t("adm.pendingReview")}p{t("adm.pendingReview")}a{t("adm.pendingReview")}n{t("adm.pendingReview")}>{t("adm.pendingReview")};
 {t("adm.suspended")} {t("adm.suspended")}i{t("adm.suspended")}f{t("adm.suspended")} {t("adm.suspended")}({t("adm.suspended")}s{t("adm.suspended")}t{t("adm.suspended")}a{t("adm.suspended")}t{t("adm.suspended")}u{t("adm.suspended")}s{t("adm.suspended")} {t("adm.suspended")}={t("adm.suspended")}={t("adm.suspended")}={t("adm.suspended")} {t("adm.suspended")}"{t("adm.suspended")}s{t("adm.suspended")}u{t("adm.suspended")}s{t("adm.suspended")}p{t("adm.suspended")}e{t("adm.suspended")}n{t("adm.suspended")}d{t("adm.suspended")}e{t("adm.suspended")}d{t("adm.suspended")}"{t("adm.suspended")}){t("adm.suspended")} {t("adm.suspended")}r{t("adm.suspended")}e{t("adm.suspended")}t{t("adm.suspended")}u{t("adm.suspended")}r{t("adm.suspended")}n{t("adm.suspended")} {t("adm.suspended")}<{t("adm.suspended")}s{t("adm.suspended")}p{t("adm.suspended")}a{t("adm.suspended")}n{t("adm.suspended")} {t("adm.suspended")}c{t("adm.suspended")}l{t("adm.suspended")}a{t("adm.suspended")}s{t("adm.suspended")}s{t("adm.suspended")}N{t("adm.suspended")}a{t("adm.suspended")}m{t("adm.suspended")}e{t("adm.suspended")}={t("adm.suspended")}"{t("adm.suspended")}v{t("adm.suspended")}k{t("adm.suspended")}-{t("adm.suspended")}b{t("adm.suspended")}a{t("adm.suspended")}d{t("adm.suspended")}g{t("adm.suspended")}e{t("adm.suspended")} {t("adm.suspended")}n{t("adm.suspended")}o{t("adm.suspended")}"{t("adm.suspended")}>{t("adm.suspended")}<{t("adm.suspended")}B{t("adm.suspended")}a{t("adm.suspended")}n{t("adm.suspended")} {t("adm.suspended")}s{t("adm.suspended")}i{t("adm.suspended")}z{t("adm.suspended")}e{t("adm.suspended")}={t("adm.suspended")}{{t("adm.suspended")}1{t("adm.suspended")}1{t("adm.suspended")}}{t("adm.suspended")} {t("adm.suspended")}/{t("adm.suspended")}>{t("adm.suspended")} {t("adm.suspended")}م{t("adm.suspended")}ع{t("adm.suspended")}ل{t("adm.suspended")}ّ{t("adm.suspended")}ق{t("adm.suspended")}<{t("adm.suspended")}/{t("adm.suspended")}s{t("adm.suspended")}p{t("adm.suspended")}a{t("adm.suspended")}n{t("adm.suspended")}>{t("adm.suspended")};
  return <span className="vk-badge">{status}</span>;
}

type ReviewDrawerProps = {
  app: AdminApplication;
  docs: AdminDocument[];
  docsLoading: boolean;
  docUrls: Record<string, string>;
  onOpenDoc: (d: AdminDocument) => void;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  actionLoading: boolean;
  actionError: { message: string; tech: string } | null;
  rejecting: boolean;
  rejectReason: string;
  setRejectReason: (v: string) => void;
  confirmReject: () => void;
  cancelReject: () => void;
};

function ReviewDrawer(props: ReviewDrawerProps) {
  const { t } = useLanguage();
  const {
    app, docs, docsLoading, docUrls, onOpenDoc, onClose, onApprove, onReject,
    actionLoading, actionError, rejecting, rejectReason, setRejectReason, confirmReject, cancelReject,
  } = props;
  return (
    <div className="vk-drawer-overlay" onClick={onClose}>
      <div className="vk-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="vk-drawer-head">
          <div>
            <span className="section-kicker">{t("adm.reviewApplication")}</span>
            <h2>{t("adm.applicant")}</h2>
          </div>
          <button className="ghost-button" onClick={onClose}><X size={16} /> {t("adm.close")}</button>
        </div>
        <div className="vk-drawer-body">
          <section className="vk-section">
            <h3>{t("adm.personalInfo")}</h3>
            {app.avatar_url ? (
              <div className="profile-image-wrap" style={{ marginBottom: 14 }}>
                <img src={app.avatar_url} alt={app.full_name || ""} />
              </div>
            ) : null}
            <div className="vk-rows">
              <div className="vk-row"><span>{t("adm.fullName")}</span><b>{app.full_name || "—"}</b></div>
              <div className="vk-row"><span>{t("adm.phone")}</span><b dir="ltr">{app.phone || "—"}</b></div>
              <div className="vk-row"><span>{t("adm.city")}</span><b>{app.city || "—"}</b></div>
            </div>
          </section>
          <section className="vk-section">
            <h3>{t("adm.professionalInfo")}</h3>
            <div className="vk-rows">
              <div className="vk-row"><span>{t("adm.profession")}</span><b>{app.profession || "—"}</b></div>
              <div className="vk-row"><span>{t("adm.serviceCategory")}</span><b>{app.service_category || "—"}</b></div>
              <div className="vk-row"><span>{t("adm.experienceYears")}</span><b>{app.experience_years ?? "—"}</b></div>
              <div className="vk-row vk-row-stack"><span>{t("adm.bio")}</span><b>{app.bio || "—"}</b></div>
            </div>
          </section>
          <section className="vk-section">
            <h3>{t("adm.uploadedDocs")}</h3>
            {docsLoading ? (
              <div className="state-loading"><Loader2 className="spin" size={18} /><p>{t("adm.loadingDocs")}</p></div>
            ) : docs.length === 0 ? (
              <p className="vk-empty">{t("adm.noDocs")}</p>
            ) : (
              <div className="vk-docs">
                {docs.map((d) => (
                  <div className="vk-doc" key={d.id}>
                    <span className="vk-doc-icon"><FileText size={15} /></span>
                    <div className="vk-doc-info">
                      <b>{admin.DOC_LABELS[d.document_type] || d.document_type}</b>
                      <span>{t("adm.statusLabel")}</span>
                    </div>
                    <button className="mini-button" type="button" onClick={() => onOpenDoc(d)}>
                      <ExternalLink size={13} /> عرض
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
          {app.verification_status === "rejected" && app.rejection_reason ? (
            <div className="vk-reason"><b>سبب الرفض:</b> <span>{app.rejection_reason}</span></div>
          ) : null}
        </div>
        <div className="vk-drawer-foot">
          {actionError ? (
            <div className="vk-action-error" role="alert">
              <AlertCircle size={14} /> {actionError.message}
              {actionError.tech ? (
                <div className="vk-action-error-tech">{actionError.tech}</div>
              ) : null}
            </div>
          ) : null}
          {rejecting ? (
            <>
              <textarea
                className="vk-textarea"
                rows={3}
                placeholder="placeholder={t("adm.rejectPlaceholder")}"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <div className="cta-row" style={{ margin: 0 }}>
                <button className="primary" type="button" onClick={confirmReject} disabled={actionLoading}>
                  {actionLoading ? <Loader2 className="spin" size={15} /> : null} تأكيد الرفض
                </button>
                <button className="secondary" type="button" onClick={cancelReject} disabled={actionLoading}>{t("adm.cancel")}</button>
              </div>
            </>
          ) : (
            <div className="cta-row" style={{ margin: 0 }}>
              <button className="primary" type="button" onClick={onApprove} disabled={actionLoading}>
                {actionLoading ? <Loader2 className="spin" size={15} /> : <ShieldCheck size={15} />} قبول مقدّم الخدمة
              </button>
              <button className="secondary" type="button" onClick={onReject} disabled={actionLoading}>
                <Ban size={15} /> رفض الطلب
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Map raw RPC/network errors to actionable Arabic messages; the raw error
   is also captured in the console for development diagnostics. */
function explainActionError(raw: string): string {
  const s = raw.toLowerCase();
  if (s.includes("jwt") || s.includes("token") || s.includes("session") || s.includes("expired")) {
    return "انتهت جلسة المشرف — سجّل الدخول من جديد";
  }
  if (s.includes("forbidden")) return "لا تملك صلاحية المشرف لهذا الإجراء";
  if (s.includes("could not find the function")) return "المعرّف غير صالح";
  if (s.includes("not allowed")) return "تعذّر اعتماد مقدّم الخدمة — قيود التحقق في قاعدة البيانات";
  return "تعذّر اعتماد مقدّم الخدمة";
}

export default function Admin({ switchRole }: { switchRole: () => void }) {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const { showToast } = useToast();

  const [tab, setTab] = useState<Tab>("التحقق من المقدّمين");
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<CountStatus, number>>({ pending: 0, approved: 0, rejected: 0 });
  const [filter, setFilter] = useState<VerificationStatus>("pending");
  const [apps, setApps] = useState<AdminApplication[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [selected, setSelected] = useState<AdminApplication | null>(null);
  const [docs, setDocs] = useState<AdminDocument[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [docUrls, setDocUrls] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<{ message: string; tech: string } | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  async function reloadCounts() {
    try {
      const [p, a, r] = await Promise.all([
        admin.countByStatus("pending"),
        admin.countByStatus("approved"),
        admin.countByStatus("rejected"),
      ]);
      setCounts({ pending: p, approved: a, rejected: r });
    } catch (e) {
      setLoadErr(e instanceof Error ? e.message : "تعذّر تحميل الإحصائيات");
    }
  }

  async function reloadList(status: VerificationStatus) {
    setListLoading(true);
    try {
      setApps(await admin.listApplications(status));
      setLoadErr(null);
    } catch (e) {
      setLoadErr(e instanceof Error ? e.message : "تعذّر تحميل الطلبات");
      setApps([]);
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      await reloadCounts();
      if (active) setLoading(false);
    })();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      setListLoading(true);
      try {
        const list = await admin.listApplications(filter);
        if (active) { setApps(list); setLoadErr(null); }
      } catch (e) {
        if (active) { setLoadErr(e instanceof Error ? e.message : "تعذّر تحميل الطلبات"); setApps([]); }
      } finally {
        if (active) setListLoading(false);
      }
    })();
    return () => { active = false; };
  }, [filter]);

  async function openReview(app: AdminApplication) {
    setSelected(app);
    setDocs([]);
    setDocUrls({});
    setActionError(null);
    setDocsLoading(true);
    try {
      setDocs(await admin.listApplicationDocuments(app.id));
    } catch (e) {
      showToast(e instanceof Error ? e.message : "تعذّر تحميل الوثائق");
    } finally {
      setDocsLoading(false);
    }
  }

  async function openDoc(doc: AdminDocument) {
    const cached = docUrls[doc.id];
    if (cached) { window.open(cached, "_blank", "noopener"); return; }
    try {
      const url = await admin.signedDocumentUrl(doc.storage_path);
      setDocUrls((m) => ({ ...m, [doc.id]: url }));
      window.open(url, "_blank", "noopener");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "تعذّر فتح الوثيقة");
    }
  }

  async function handleApprove() {
    if (!selected?.id) {
      setActionError({ message: "المعرّف غير صالح — أغلق المراجعة وافتح الطلب مجدداً", tech: "" });
      return;
    }
    setActionError(null);
    setActionLoading(true);
    try {
      await admin.approveProvider(selected.id);
      showToast("تم قبول مقدّم الخدمة");
      setSelected(null);
      await Promise.all([reloadCounts(), reloadList(filter)]);
    } catch (e) {
      const err = e as { message?: string; code?: string; details?: string | null; hint?: string | null };
      const raw = typeof err?.message === "string" && err.message ? err.message : String(e);
      const tech = [err?.code, raw, err?.details, err?.hint].filter((v) => v != null && v !== "").join(" · ");
      console.error("[admin] approve failed — provider_profile_id:", selected.id, "| full error object:", e);
      const message = explainActionError(raw);
      setActionError({ message, tech });
      showToast(message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    if (!selected?.id) {
      setActionError({ message: "المعرّف غير صالح — أغلق المراجعة وافتح الطلب مجدداً", tech: "" });
      return;
    }
    setActionError(null);
    setActionLoading(true);
    try {
      await admin.rejectProvider(selected.id, rejectReason);
      showToast(t("status.rejected"));
      setRejectOpen(false);
      setRejectReason("");
      setSelected(null);
      await Promise.all([reloadCounts(), reloadList(filter)]);
    } catch (e) {
      const err = e as { message?: string; code?: string; details?: string | null; hint?: string | null };
      const raw = typeof err?.message === "string" && err.message ? err.message : String(e);
      const tech = [err?.code, raw, err?.details, err?.hint].filter((v) => v != null && v !== "").join(" · ");
      console.error("[admin] reject failed — provider_profile_id:", selected.id, "| full error object:", e);
      const message = explainActionError(raw);
      setActionError({ message, tech });
      showToast(message);
    } finally {
      setActionLoading(false);
    }
  }

  const adminName = profile?.full_name || "إدارة معاك";

  return (
    <div className="admin">
      <aside className="admin-side">
        <Logo inverse />
        <div className="provider-side-title">
          <span>لوحة الإدارة</span>
          <b>{adminName}</b>
        </div>
        {TABS.map((item) => (
          <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>
        ))}
        <button className="return-app" onClick={switchRole}>{t("acct.signOut")}</button>
      </aside>
      <main className="admin-main">
        <div className="admin-top">
          <div>
            <span className="section-kicker">إدارة معك</span>
            <h1>{tab}</h1>
          </div>
          <span className="avatar">إ</span>
        </div>

        {loading ? (
          <div className="state-loading"><Loader2 className="spin" size={26} /><p>نحمّل لوحة التحقق…</p></div>
        ) : tab === "نظرة عامة" ? (
          <>
            <div className="metric-row">
              <div className="metric"><small>طلبات قيد المراجعة</small><strong>{counts.pending}</strong><span>بانتظار القرار</span></div>
              <div className="metric"><small>مقدّمون مقبولون</small><strong>{counts.approved}</strong><span>تم التحقق</span></div>
              <div className="metric"><small>طلبات مرفوضة</small><strong>{counts.rejected}</strong><span>تتطلب متابعة</span></div>
            </div>
            <div className="panel">
              <h2>التحقق من مقدّمي الخدمة</h2>
              <p>راجع طلبات التقديم، افتح الوثائق الخاصة، واقبل أو ارفض كل طلب.</p>
              <button className="primary" onClick={() => setTab("التحقق من المقدّمين")}>فتح قائمة التحقق <ArrowLeft size={15} /></button>
            </div>
          </>
        ) : loadErr && apps.length === 0 && !listLoading ? (
          <div className="state-error">
            <AlertCircle size={26} />
            <h3>تعذّر تحميل البيانات</h3>
            <p>{loadErr}</p>
            <button className="secondary" onClick={() => window.location.reload()}>{t("common.retryBtn")}</button>
          </div>
        ) : (
          <>
            <div className="chips" style={{ marginBottom: 18 }}>
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s.key}
                  className={"filter-button" + (filter === s.key ? " active" : "")}
                  onClick={() => setFilter(s.key)}
                >
                  {s.label} · {counts[s.key]}
                </button>
              ))}
            </div>
            {listLoading ? (
              <div className="state-loading"><Loader2 className="spin" size={24} /><p>نحمّل الطلبات…</p></div>
            ) : apps.length === 0 ? (
              <div className="panel"><p>{t("bookings.emptyFiltered")}</p></div>
            ) : (
              <div className="vk-list">
                {apps.map((app) => (
                  <div className="vk-card" key={app.id}>
                    <div className="vk-card-main">
                      <div className="vk-avatar">{(app.full_name || app.id).charAt(0)}</div>
                      <div className="vk-card-info">
                        <div className="vk-card-head">{app.full_name || "متقدّم"} {statusBadge(app.verification_status, t)}</div>
                        <p>{app.profession || "—"} · {app.city || "—"}</p>
                      </div>
                    </div>
                    <button className="secondary" onClick={() => openReview(app)}>مراجعة <ArrowLeft size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {selected ? (
          <ReviewDrawer
            app={selected}
            docs={docs}
            docsLoading={docsLoading}
            docUrls={docUrls}
            onOpenDoc={openDoc}
            onClose={() => setSelected(null)}
            onApprove={handleApprove}
            onReject={() => { setRejectOpen(true); setRejectReason(""); setActionError(null); }}
            actionLoading={actionLoading}
            actionError={actionError}
            rejecting={rejectOpen}
            rejectReason={rejectReason}
            setRejectReason={setRejectReason}
            confirmReject={handleReject}
            cancelReject={() => { setRejectOpen(false); setRejectReason(""); }}
          />
        ) : null}
      </main>
    </div>
  );
}
