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