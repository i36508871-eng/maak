import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { Provider, ProviderRow } from "./types";

const DB_PATH = process.env.MAAK_DB_PATH
  ? resolve(process.env.MAAK_DB_PATH)
  : resolve(process.cwd(), "server/data/maak.db");

let instance: Database.Database | null = null;

const SCHEMA =
  "CREATE TABLE IF NOT EXISTS providers (" +
  "id INTEGER PRIMARY KEY, name TEXT NOT NULL, job TEXT NOT NULL, " +
  "city TEXT NOT NULL, distance TEXT NOT NULL, price TEXT NOT NULL, " +
  "rating TEXT NOT NULL, reviews INTEGER NOT NULL, image TEXT NOT NULL, " +
  "available INTEGER NOT NULL, services TEXT NOT NULL, " +
  "experience TEXT NOT NULL, intro TEXT NOT NULL)";

export function getDb(): Database.Database {
  if (instance) return instance;
  const dir = dirname(DB_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(SCHEMA);
  instance = db;
  return db;
}

export function dbPath(): string {
  return DB_PATH;
}

function rowToProvider(row: ProviderRow): Provider {
  return {
    id: row.id,
    name: row.name,
    job: row.job,
    city: row.city,
    distance: row.distance,
    price: row.price,
    rating: row.rating,
    reviews: row.reviews,
    image: row.image,
    available: row.available === 1,
    services: JSON.parse(row.services) as string[],
    experience: row.experience,
    intro: row.intro,
  };
}

export function listProviders(): Provider[] {
  const rows = getDb()
    .prepare("SELECT * FROM providers ORDER BY id ASC")
    .all() as ProviderRow[];
  return rows.map(rowToProvider);
}

export function findProvider(id: number): Provider | undefined {
  const row = getDb().prepare("SELECT * FROM providers WHERE id = ?").get(id) as
    | ProviderRow
    | undefined;
  return row ? rowToProvider(row) : undefined;
}

export function clearProviders(): void {
  getDb().prepare("DELETE FROM providers").run();
}

export function insertProvider(provider: Provider): void {
  getDb()
    .prepare(
      "INSERT INTO providers (id,name,job,city,distance,price,rating,reviews," +
        "image,available,services,experience,intro) VALUES (" +
        "@id,@name,@job,@city,@distance,@price,@rating,@reviews," +
        "@image,@available,@services,@experience,@intro)"
    )
    .run({
      id: provider.id,
      name: provider.name,
      job: provider.job,
      city: provider.city,
      distance: provider.distance,
      price: provider.price,
      rating: provider.rating,
      reviews: provider.reviews,
      image: provider.image,
      available: provider.available ? 1 : 0,
      services: JSON.stringify(provider.services),
      experience: provider.experience,
      intro: provider.intro,
    });
}
