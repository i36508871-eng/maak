import { clearProviders, getDb, insertProvider } from "./db";
import { seedProviders } from "./data/seed-providers";

function main() {
  const db = getDb();
  const seed = db.transaction(() => {
    clearProviders();
    for (const provider of seedProviders) insertProvider(provider);
  });
  seed();
  console.log("Seeded " + seedProviders.length + " providers into " + getDb().name);
}

main();
