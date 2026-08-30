// Provider shape stored in PostgreSQL and returned by the API.
// available is a boolean; services is a JSONB column returned by pg as a parsed array.
export type ProviderRow = {
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

// API-facing type (alias of the row shape).
export type Provider = ProviderRow;
