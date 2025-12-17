import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve("database", "app.db");
const db = new Database(dbPath);
// create table if not already there
db.prepare(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    start TEXT NOT NULL,
    end TEXT,
    project_id INTEGER REFERENCES projects(id)
  )
`).run();


db.prepare(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    address TEXT NOT NULL,
    startMonth TEXT NOT NULL,
    archived INTEGER DEFAULT 0
  )
`).run();

export default db;