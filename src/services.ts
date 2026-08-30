import { categories, initialBookings, providers } from "./data";
import type { Booking, Category, Provider } from "./types";

/**
 * Data access layer.
 *
 * Today this reads from the local mock data in `src/data.ts`, but it is the
 * only place the UI talks to for providers / categories / bookings. When a
 * real backend is introduced in a later sprint, only this file changes — the
 * pages and components keep calling the same functions.
 */

export function getProviders(): Provider[] {
  return providers;
}

export function getProviderById(id: number): Provider | undefined {
  return providers.find((provider) => provider.id === id);
}

export function getCategories(): Category[] {
  return categories;
}

export function getInitialBookings(): Booking[] {
  return initialBookings;
}

export function searchProviders(query: string): Provider[] {
  if (!query) return providers;
  return providers.filter(
    (provider) =>
      provider.job.includes(query) ||
      provider.services.some((service) => service.includes(query)) ||
      provider.name.includes(query),
  );
}