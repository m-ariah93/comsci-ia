import bcrypt from "bcrypt";
import { connect } from "@tursodatabase/serverless";

export const db = connect({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});


export async function initDb() {

  await db.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL CHECK (length(title)<=30),
      address TEXT NOT NULL,
      start_month TEXT NOT NULL CHECK (length(start_month)=7),
      colour TEXT NOT NULL CHECK (length(colour)=7),
      archived INTEGER DEFAULT 0 CHECK (archived=0 OR archived=1)
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS booking_templates (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS checklist (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      note TEXT,
      done INTEGER DEFAULT 0 CHECK (done=0 OR done=1),
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT, 
      email_greeting TEXT,
      email_closing TEXT,
      notifications INTEGER NOT NULL DEFAULT 1 CHECK (notifications=0 OR notifications=1),
      email_address TEXT
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      start TEXT NOT NULL,
      end TEXT,
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      template_id INTEGER REFERENCES booking_templates(id)
    )
  `);

  const username = "admin";
  const plainPassword = "123";

  const hash = bcrypt.hashSync(plainPassword, 10);

  await db.execute(
    "INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)",
    [username, hash]
  );

}

export default db;