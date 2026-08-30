import { Pool } from "pg";
import type { Provider, ProviderRow } from "./types";

const DATABASE_URL = process.env.DATABASE_URL;

let pool: Pool | null = null;

const SCHEMA =
  "CREATE TABLE IF NOT EXISTS providers (" +
  "id INTEGER PRIMARY KEY, name TEXT NOT NULL, job TEXT NOT NULL, " +
  "city TEXT NOT NULL, distance TEXT NOT NULL, price TEXT NOT NULL, " +
  "rating TEXT NOT NULL, reviews INTEGER NOT NULL, image TEXT NOT NULL, " +
  "available BOOLEAN NOT NULL, services JSONB NOT NULL, " +
  "experience TEXT NOT NULL, intro TEXT NOT NULL)";

export function getPool(): Pool {
  if (pool) return pool;
  if (!DATABASE_URL) throw new Error("DATABASE_URL is not set");
  const isLocal = /localhost|127\.0\.0\.1/.test(DATABASE_URL);
  pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: isLocal ? undefined : { rejectUnauthorized: false },
    max: 5,
  });
  return pool;
}

export async function initDb(): Promise<void> {
  await getPool().query(SCHEMA);
}

function rowToProvider(row: ProviderRow): Provider {
  return { ...row };
}

export async function listProviders(): Promise<Provider[]> {
  const result = await getPool().query("SELECT * FROM providers ORDER BY id ASC");
  return (result.rows as ProviderRow[]).map(rowToProvider);
}

export async function findProvider(id: number): Promise<Provider | undefined> {
  const result = await getPool().query("SELECT * FROM providers WHERE id = $1", [id]);
  const rows = result.rows as ProviderRow[];
  return rows[0] ? rowToProvider(rows[0]) : undefined;
}

export async function clearProviders(): Promise<void> {
  await getPool().query("DELETE FROM providers");
}

export async function insertProvider(provider: Provider): Promise<void> {
  await getPool().query(
    "INSERT INTO providers " +
      "(id,name,job,city,distance,price,rating,reviews,image,available,services,experience,intro) " +
      "VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)",
    [
      provider.id,
      provider.name,
      provider.job,
      provider.city,
      provider.distance,
      provider.price,
      provider.rating,
      provider.reviews,
      provider.image,
      provider.available,
      JSON.stringify(provider.services),
      provider.experience,
      provider.intro,
    ],
  );
}
