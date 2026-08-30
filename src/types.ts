import type { LucideIcon } from "lucide-react";

export type Provider = {
  id: number;
  name: string;
  job: string;
  city: string;
  distance: string;
  price: string;
  rating: string;
  reviews: number;
  image: string;
  available: boolean;
  services: string[];
  experience: string;
  intro: string;
};

export type Booking = {
  id: number;
  service: string;
  provider: string;
  date: string;
  time: string;
  location: string;
  status: string;
};

export type Category = {
  name: string;
  icon: LucideIcon;
  count: string;
};

/* ----------------------- Sprint 6: identity & roles ----------------------- */

export type Role = "customer" | "provider" | "admin";

export type Profile = {
  id: string;
  role: Role;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type VerificationStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "suspended";

/* ----------------------- Sprint 7: provider onboarding ----------------------- */

export type ProviderProfile = {
  id: string;
  profession: string | null;
  service_category: string | null;
  bio: string | null;
  experience_years: number | null;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
};

export type ProviderDocument = {
  id: string;
  provider_id: string;
  document_type: string;
  storage_path: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};
