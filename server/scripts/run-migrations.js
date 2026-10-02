/**
 * Minimal migration runner.
 * Reads every .sql file in /database/migrations (sorted by filename) and
 * executes it against DATABASE_URL. Good enough for a solo project;
 * swap for a real migration tool (e.g. node-pg-migrate) once this grows.
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

async function main() {
  const migrationsDir = path.join(__dirname, "..", "..", "database", "migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("No migration files found in", migrationsDir);
    return;
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    for (const file of files) {
      const fullPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(fullPath, "utf8");
      console.log(`Running migration: ${file}`);
      await client.query(sql);
    }
    console.log("All migrations applied successfully.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
