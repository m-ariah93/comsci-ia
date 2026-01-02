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
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    template_id INTEGER REFERENCES booking_templates(id)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL CHECK (length(title)<=30),
    address TEXT NOT NULL,
    start_month TEXT NOT NULL CHECK (length(start_month)=7),
    colour TEXT NOT NULL CHECK (length(colour)=7),
    archived INTEGER DEFAULT 0 CHECK (archived=0 OR archived=1)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS booking_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS checklist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER DEFAULT 0 CHECK (done=0 OR done=1),
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE
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