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

export type Category = {
  name: string;
  icon: LucideIcon;
  count: string;
};

/* ----------------------- Booking (real backend) ----------------------- */

export type BookingStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "in_progress"
  | "completed";

export type BookingRow = {
  id: string;
  customer_id: string;
  provider_id: string;
  provider_listing_id: number | null;
  service_category: string;
  service_description: string;
  service_date: string | null;
  location_text: string | null;
  customer_note: string;
  provider_note: string;
  status: BookingStatus;
  rejection_reason: string | null;
  customer_name: string | null;
  created_at: string;
  updated_at: string;
  accepted_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
};

/* ----------------------- Identity & roles ----------------------- */

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

/* ----------------------- Provider onboarding ----------------------- */

export type ProviderProfile = {
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

export type ProviderDocument = {
  id: string;
  provider_id: string;
  document_type: string;
  storage_path: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};
