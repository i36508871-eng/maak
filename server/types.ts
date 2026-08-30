// Raw row shape as stored in SQLite (services is a JSON string, available is 0/1).
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
  available: number;
  services: string;
  experience: string;
  intro: string;
};

// Provider as returned by the API (deserialized for the client).
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
