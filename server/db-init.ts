import { initDb } from "./db";

async function main(): Promise<void> {
  await initDb();
  console.log("providers table ready");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
