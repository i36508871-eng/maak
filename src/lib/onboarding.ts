import { supabase } from "./supabaseClient";
import type { VerificationStatus } from "../types";

export const SERVICE_CATEGORIES = [
  "سباكة",
  "كهرباء",
  "تنظيف",
  "نقل وأثاث",
  "دهان وديكور",
  "نجارة",
  "تكييف وتبريد",
  "صيانة عامة",
  "حدادة",
  "زراعة وحديقة",
  "تقنية وحواسيب",
  "أخرى",
] as const;

export const SERVICE_OPTIONS = [
  "تسريب الماء",
  "تركيب صنابير",
  "إصلاح سخان",
  "تمديد كهرباء",
  "إنارة ولوحات",
  "صيانة الأجهزة",
  "تنظيف منزل",
  "تنظيف بعد البناء",
  "نقل أثاث",
  "تركيب الأثاث",
  "دهان جدران",
  "ديكور وجبس",
  "نجارة أبواب",
  "صيانة تكييف",
  "إصلاحات عامة",
] as const;

export const DOC_TYPES = {
  national_id: { label: "onb.docNationalId", required: true, accept: "image/png,image/jpeg,application/pdf" },
  profile_photo: { label: "onb.docProfilePhoto", required: true, accept: "image/png,image/jpeg" },
  professional_document: { label: "onb.docProfessional", required: false, accept: "image/png,image/jpeg,application/pdf" },
} as const;

export type DocType = keyof typeof DOC_TYPES;

export const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/jpg", "application/pdf"]);

export type OnboardingPersonal = { full_name: string; phone: string; city: string };
export type OnboardingProfessional = {
  profession: string;
  service_category: string;
  experience_years: string;
  bio: string;
  services: string[];
  price_from: string;
  service_radius_km: string;
};

export type ProviderProfileRow = {
  id: string;
  profession: string | null;
  service_category: string | null;
  bio: string | null;
  experience_years: number | null;
  services: string[] | null;
  price_from: number | null;
  service_radius_km: number | null;
  profile_photo_public: boolean;
  verification_status: VerificationStatus;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type ProviderDocumentRow = {
  id: string;
  provider_id: string;
  document_type: string;
  storage_path: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export function validateFile(file: File): string | null {
  if (!file) return "onb.vFileRequired";
  if (file.size === 0) return "onb.vFileEmpty";
  if (file.size > MAX_FILE_BYTES) return "onb.vFileBig";
  if (!ALLOWED_MIME.has(file.type)) return "onb.vFileMime";
  return null;
}

export function validatePhone(phone: string): string | null {
  const v = (phone || "").trim();
  if (!v) return "onb.vPhoneRequired";
  if (!/^[0-9+\s-]{8,15}$/.test(v)) return "onb.vPhoneInvalid";
  return null;
}

export function validatePersonal(p: OnboardingPersonal): string | null {
  if (!p.full_name.trim()) return "onb.vFullName";
  if (!p.city.trim()) return "onb.vCity";
  return validatePhone(p.phone);
}

export function validateProfessional(p: OnboardingProfessional): string | null {
  if (!p.profession.trim()) return "onb.vProfession";
  if (!p.service_category) return "اختر فئة الخدمة";
  const exp = p.experience_years.trim();
  if (exp !== "" && !/^\d{1,2}$/.test(exp)) return "سنوات الخبرة: رقم صحيح بين 0 و 99";
  if (!p.bio.trim()) return "النبذة مطلوبة";
  const price = p.price_from.trim();
  if (price !== "" && (isNaN(Number(price)) || Number(price) < 0)) return "السعر: رقم صحيح غير سالب";
  const radius = p.service_radius_km.trim();
  if (radius !== "" && (isNaN(Number(radius)) || Number(radius) <= 0)) return "نطاق العمل: رقم صحيح موجب";
  return null;
}

function extFromMime(mime: string, name: string): string {
  if (mime === "image/png") return ".png";
  if (mime === "image/jpeg" || mime === "image/jpg") return ".jpg";
  if (mime === "application/pdf") return ".pdf";
  const m = (name || "").match(/\.(\w{1,5})$/);
  return m ? "." + m[1].toLowerCase() : ".bin";
}

function buildStoragePath(userId: string, docType: DocType, ext: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return userId + "/" + docType + "-" + Date.now() + "-" + rand + ext;
}

export async function fetchProviderProfile(userId: string): Promise<ProviderProfileRow | null> {
  const { data, error } = await supabase
    .from("provider_profiles")
    .select("id,profession,service_category,bio,experience_years,services,price_from,service_radius_km,profile_photo_public,verification_status,rejection_reason,created_at,updated_at")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw new Error("تعذّر تحميل حالة طلبك");
  return (data as ProviderProfileRow | null) ?? null;
}

export async function ensureDraft(userId: string): Promise<ProviderProfileRow> {
  const existing = await fetchProviderProfile(userId);
  if (existing) return existing;
  const { data, error } = await supabase
    .from("provider_profiles")
    .insert({ id: userId, verification_status: "draft" })
    .select("id,profession,service_category,bio,experience_years,services,price_from,service_radius_km,profile_photo_public,verification_status,rejection_reason,created_at,updated_at")
    .single();
  if (error) {
    if (/duplicate|unique|23505/i.test(error.message || "")) {
      const ref = await fetchProviderProfile(userId);
      if (ref) return ref;
    }
    throw new Error("تعذّر بدء الطلب. حاول مرة أخرى");
  }
  return data as ProviderProfileRow;
}

export async function listDocuments(providerId: string): Promise<ProviderDocumentRow[]> {
  const { data, error } = await supabase
    .from("provider_documents")
    .select("id,provider_id,document_type,storage_path,status,created_at")
    .eq("provider_id", providerId)
    .order("created_at", { ascending: true });
  if (error) throw new Error("تعذّر تحميل الوثائق");
  return (data as ProviderDocumentRow[] | null) ?? [];
}

export async function uploadDocument(userId: string, docType: DocType, file: File): Promise<ProviderDocumentRow> {
  const verr = validateFile(file);
  if (verr) throw new Error(verr);
  const ext = extFromMime(file.type, file.name);
  const path = buildStoragePath(userId, docType, ext);
  const { error: upErr } = await supabase.storage
    .from("provider-documents")
    .upload(path, file, { contentType: file.type || "application/octet-stream", upsert: false });
  if (upErr) throw new Error("تعذّر رفع الملف. تحقق من الاتصال وحاول مرة أخرى");
  const { data, error: insErr } = await supabase
    .from("provider_documents")
    .insert({ provider_id: userId, document_type: docType, storage_path: path, status: "pending" })
    .select("id,provider_id,document_type,storage_path,status,created_at")
    .single();
  if (insErr) {
    await supabase.storage.from("provider-documents").remove([path]);
    throw new Error("تعذّر تسجيل الوثيقة");
  }
  return data as ProviderDocumentRow;
}

export async function deleteDocument(doc: { id: string; storage_path: string }): Promise<void> {
  if (doc?.storage_path) {
    await supabase.storage.from("provider-documents").remove([doc.storage_path]);
  }
  if (doc?.id) {
    await supabase.from("provider_documents").delete().eq("id", doc.id);
  }
}

export async function submitOnboarding(
  userId: string,
  personal: OnboardingPersonal,
  professional: OnboardingProfessional,
  requiredDocTypes: DocType[],
): Promise<void> {
  const { error: pErr } = await supabase
    .from("profiles")
    .update({ full_name: personal.full_name.trim(), phone: personal.phone.trim(), city: personal.city.trim() })
    .eq("id", userId);
  if (pErr) throw new Error("تعذّر حفظ بياناتك الشخصية");

  const exp = professional.experience_years.trim();
  const price = professional.price_from.trim();
  const radius = professional.service_radius_km.trim();
  const { error: ppErr } = await supabase
    .from("provider_profiles")
    .upsert(
      {
        id: userId,
        profession: professional.profession.trim() || null,
        service_category: professional.service_category || null,
        bio: professional.bio.trim() || null,
        experience_years: exp === "" ? null : Number(exp),
        services: professional.services.length ? professional.services : null,
        price_from: price === "" ? null : Number(price),
        service_radius_km: radius === "" ? null : Number(radius),
        verification_status: "pending",
      },
      { onConflict: "id" },
    );
  if (ppErr) throw new Error("تعذّر تسجيل طلبك. حاول مرة أخرى");

  const docs = await listDocuments(userId);
  for (const t of requiredDocTypes) {
    if (!docs.some((d) => d.document_type === t)) {
      throw new Error("يرجى رفع جميع الوثائق المطلوبة");
    }
  }
}

export async function updateProviderMarketplaceProfile(userId: string, input: {
  services: string[];
  price_from: string;
  service_radius_km: string;
  profile_photo_public: boolean;
}): Promise<void> {
  const { error } = await supabase.rpc("update_provider_marketplace_profile", {
    p_services: input.services,
    p_price_from: input.price_from.trim() === "" ? null : Number(input.price_from),
    p_service_radius_km: input.service_radius_km.trim() === "" ? null : Number(input.service_radius_km),
    p_profile_photo_public: input.profile_photo_public,
  });
  if (error) throw new Error("تعذّر حفظ بيانات ملفك المهني");
}
