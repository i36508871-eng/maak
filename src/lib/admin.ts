import { supabase } from "./supabaseClient";
import type { VerificationStatus } from "../types";

export type AdminApplication = {
  id: string;
  profession: string | null;
  service_category: string | null;
  bio: string | null;
  experience_years: number | null;
  verification_status: VerificationStatus;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  avatar_url: string | null;
};

export type AdminDocument = {
  id: string;
  document_type: string;
  storage_path: string;
  status: string;
  created_at: string;
};

export const DOC_LABELS: Record<string, string> = {
  national_id: "onb.docNationalId",
  profile_photo: "onb.docProfilePhoto",
  professional_document: "adm.doc_professional_document",
  other: "adm.doc_other",
};

/* Preserve the exact Supabase/PostgREST error: its objects are plain
   { message, code, details, hint } and are NOT instanceof Error, so the
   previous implementation always threw the generic fallback and the real
   backend error was lost. Attach code/details/hint for diagnostics. */
function msg(e: unknown, fallback: string): Error {
  const source = (e ?? {}) as { message?: unknown; code?: unknown; details?: unknown; hint?: unknown };
  const err = new Error(
    typeof source.message === "string" && source.message ? source.message : fallback,
  );
  const enriched = err as Error & { code?: unknown; details?: unknown; hint?: unknown };
  if (source.code !== undefined) enriched.code = source.code;
  if (source.details !== undefined) enriched.details = source.details;
  if (source.hint !== undefined) enriched.hint = source.hint;
  return enriched;
}

export async function countByStatus(status: VerificationStatus): Promise<number> {
  const { count, error } = await supabase
    .from("provider_profiles")
    .select("id", { count: "exact", head: true })
    .eq("verification_status", status);
  if (error) throw msg(error, "تعذّر تحميل الإحصائيات");
  return count ?? 0;
}

type RawAppRow = {
  id: string;
  profession: string | null;
  service_category: string | null;
  bio: string | null;
  experience_years: number | null;
  verification_status: VerificationStatus;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
};

type RawProfile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  avatar_url: string | null;
};

function toApp(
  r: RawAppRow,
  p: RawProfile | undefined,
): AdminApplication {
  return {
    id: r.id,
    profession: r.profession,
    service_category: r.service_category,
    bio: r.bio,
    experience_years: r.experience_years,
    verification_status: r.verification_status,
    rejection_reason: r.rejection_reason,
    created_at: r.created_at,
    updated_at: r.updated_at,
    full_name: p?.full_name ?? null,
    phone: p?.phone ?? null,
    city: p?.city ?? null,
    avatar_url: p?.avatar_url ?? null,
  };
}

export async function listApplications(status: VerificationStatus): Promise<AdminApplication[]> {
  const { data: rows, error } = await supabase
    .from("provider_profiles")
    .select("id,profession,service_category,bio,experience_years,verification_status,rejection_reason,created_at,updated_at")
    .eq("verification_status", status)
    .order("updated_at", { ascending: false });
  if (error) throw msg(error, "تعذّر تحميل الطلبات");
  const list = (rows ?? []) as RawAppRow[];
  if (list.length === 0) return [];
  const ids = list.map((r) => r.id);
  const { data: profs, error: perr } = await supabase
    .from("profiles")
    .select("id,full_name,phone,city,avatar_url")
    .in("id", ids);
  if (perr) throw msg(perr, "تعذّر تحميل بيانات المتقدّمين");
  const map = new Map<string, RawProfile>((profs ?? []).map((p) => [p.id, p as RawProfile]));
  return list.map((r) => toApp(r, map.get(r.id)));
}

export async function listApplicationDocuments(providerId: string): Promise<AdminDocument[]> {
  const { data, error } = await supabase
    .from("provider_documents")
    .select("id,document_type,storage_path,status,created_at")
    .eq("provider_id", providerId)
    .order("created_at", { ascending: true });
  if (error) throw msg(error, "تعذّر تحميل الوثائق");
  return (data ?? []) as AdminDocument[];
}

export async function signedDocumentUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("provider-documents")
    .createSignedUrl(path, 300);
  if (error) throw msg(error, "تعذّر فتح الوثيقة");
  if (!data?.signedUrl) throw new Error("تعذّر فتح الوثيقة");
  return data.signedUrl;
}

export async function approveProvider(id: string): Promise<void> {
  console.info("[admin] rpc admin_approve_provider — target provider_profiles.id:", id);
  const { error } = await supabase.rpc("admin_approve_provider", { target: id });
  if (error) throw msg(error, "تعذّر قبول الطلب");
}

export async function rejectProvider(id: string, reason: string): Promise<void> {
  const trimmed = reason.trim();
  if (!trimmed) throw new Error("يرجى إدخال سبب الرفض");
  const { error } = await supabase.rpc("admin_reject_provider", { target: id, reason: trimmed });
  if (error) throw msg(error, "تعذّر رفض الطلب");
}
