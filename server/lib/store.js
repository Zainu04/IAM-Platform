import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED_PATH = path.join(__dirname, "..", "data", "seed.json");
const INIT_SQL_PATH = path.join(__dirname, "..", "data", "init-store.sql");

let writeQueue = Promise.resolve();
let ensured = false;

async function ensureStore() {
  if (ensured) return;
  const initSql = await fs.readFile(INIT_SQL_PATH, "utf8");
  await pool.query(initSql);

  const { rows } = await pool.query("SELECT 1 FROM app_store WHERE id = 1");
  if (rows.length === 0) {
    const seed = JSON.parse(await fs.readFile(SEED_PATH, "utf8"));
    await pool.query(
      "INSERT INTO app_store (id, data) VALUES (1, $1) ON CONFLICT (id) DO NOTHING",
      [JSON.stringify(seed)]
    );
  }
  ensured = true;
}

export async function readStore() {
  await ensureStore();

  const { rows } = await pool.query(
    "SELECT data FROM app_store WHERE id = 1"
  );

  return structuredClone(rows[0].data);
}

export async function writeStore(data) {
  writeQueue = writeQueue.then(async () => {
    await ensureStore();
    await pool.query(
      "UPDATE app_store SET data = $1, updated_at = NOW() WHERE id = 1",
      [JSON.stringify(data)]
    );
  });
  return writeQueue;
}

export async function updateStore(mutator) {
  writeQueue = writeQueue.then(async () => {
    await ensureStore();

    const { rows } = await pool.query(
      "SELECT data FROM app_store WHERE id = 1"
    );

    const data = rows[0].data;

    const result = await mutator(data);

    await pool.query(
      `UPDATE app_store
       SET data = $1,
           updated_at = NOW()
       WHERE id = 1`,
      [JSON.stringify(data)]
    );

    return result;
  });

  return writeQueue;
}
export function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
