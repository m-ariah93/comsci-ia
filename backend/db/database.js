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
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE
  )
`).run();


db.prepare(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    address TEXT NOT NULL,
    startMonth TEXT NOT NULL CHECK (length(startMonth)=7),
    colour TEXT NOT NULL CHECK (length(colour)=7),
    archived INTEGER DEFAULT 0 CHECK (archived=0 OR archived=1)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
  )
`).run();

export default db;