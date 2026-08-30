import { clearProviders, initDb, insertProvider } from "./db";
import { seedProviders } from "./data/seed-providers";

async function main(): Promise<void> {
  await initDb();
  await clearProviders();
  await Promise.all(seedProviders.map((p) => insertProvider(p)));
  console.log("Seeded " + seedProviders.length + " providers");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
