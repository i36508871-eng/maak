import { categories, initialBookings } from "./data";
import type { Booking, Category, Provider } from "./types";

/**
 * Data access layer.
 *
 * Providers now come from the backend API (server/). Categories and the initial
 * bookings seed are still local. The UI talks to providers through the async
 * hooks in src/hooks/useProviders.ts.
 */

const API_BASE: string = (import.meta.env.VITE_API_URL as string | undefined) || "";

export async function fetchProviders(): Promise<Provider[]> {
  const res = await fetch(API_BASE + "/api/providers");
  if (!res.ok) {
    throw new Error("فشل تحميل المقدمتين (" + res.status + ")");
  }
  return (await res.json()) as Provider[];
}

export async function fetchProvider(id: number): Promise<Provider | undefined> {
  const res = await fetch(API_BASE + "/api/providers/" + id);
  if (res.status === 404) return undefined;
  if (!res.ok) {
    throw new Error("فشل تحميل المقدم (" + res.status + ")");
  }
  return (await res.json()) as Provider;
}

export function getCategories(): Category[] {
  return categories;
}

export function getInitialBookings(): Booking[] {
  return initialBookings;
}

export function filterProviders(providers: Provider[], query: string): Provider[] {
  if (!query) return providers;
  return providers.filter(
    (provider) =>
      provider.job.includes(query) ||
      provider.services.some((service) => service.includes(query)) ||
      provider.name.includes(query),
  );
}

const CATEGORY_ROOTS: Record<string, string[]> = {
  "السباكة": ["سباك", "سباكة", "تسرب", "صنابر", "سخان", "ماء"],
  "الكهرباء": ["كهرب", "إنارة", "لوح", "تمديد", "عطل"],
  "التنظيف": ["تنظيف", "نظافة", "مرتب"],
  "الصباغة": ["صباغ", "دهان", "دهن", "صباغة"],
  "النقل": ["نقل", "أثاث", "تغليف", "تركيب"],
  "الصيانة": ["صيانة", "إصلاح", "تصليح", "عطل"],
};

export function countByCategory(providers: Provider[], category: string): number {
  const roots = CATEGORY_ROOTS[category];
  if (!roots || roots.length === 0) return providers.length;
  return providers.filter((provider) => {
    const hay = provider.job + " " + provider.services.join(" ");
    return roots.some((root) => hay.includes(root));
  }).length;
}

export function categoryCountLabel(providers: Provider[], category: string): string {
  const n = countByCategory(providers, category);
  return n > 0 ? n + " محترف" : "قريباً";
}
