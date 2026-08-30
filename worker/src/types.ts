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

// Bound resources on the Worker. Secrets are set with #wrangler secret put#;
// MAAK_ALLOW_ORIGIN is a var in wrangler.jsonc.
export interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  MAAK_ALLOW_ORIGIN: string;
  ADMIN_TOKEN: string;
}
