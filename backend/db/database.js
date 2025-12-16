import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve("database", "calendar.db");
const db = new Database(dbPath);
// create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    start TEXT NOT NULL,
    end TEXT
  )
`).run();

export default db;