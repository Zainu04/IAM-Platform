import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

// DATABASE_URL should be set as an environment variable, never hardcoded here.
// On Render: use the *Internal* Database URL for a web service running on Render
// (same region as the DB) — it's faster and doesn't leave Render's network.
// Use the *External* Database URL when connecting from your own machine, a
// different host, or local development.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn(
    "[db] DATABASE_URL is not set. Set it in your environment (.env locally, " +
    "or the Render service's Environment tab) before starting the server."
  );
}

// Render Postgres requires SSL for external connections. The internal
// connection also accepts SSL, so it's safe to always enable it, but we
// relax certificate verification since Render uses a Render-issued cert
// chain that Node doesn't have preloaded.
export const pool = new Pool({
  connectionString,
  ssl: connectionString ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("[db] Unexpected error on idle Postgres client", err);
});

export async function query(text, params) {
  return pool.query(text, params);
}
