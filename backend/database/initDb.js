// import { createClient } from "@libsql/client";
import bcrypt from "bcrypt";
import { connect } from "@tursodatabase/serverless";


// const dbPath = path.resolve("database", "app.db");
// const db = new Database(dbPath);

//console.log(process.env.TURSO_DATABASE_URL, process.env.TURSO_AUTH_TOKEN);
// const db = createClient({
//   url: process.env.TURSO_DATABASE_URL,
//   authToken: process.env.TURSO_AUTH_TOKEN,
// });

export const db = connect({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});


export async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      start TEXT NOT NULL,
      end TEXT,
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      template_id INTEGER REFERENCES booking_templates(id)
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL CHECK (length(title)<=30),
      address TEXT NOT NULL,
      start_month TEXT NOT NULL CHECK (length(start_month)=7),
      colour TEXT NOT NULL CHECK (length(colour)=7),
      archived INTEGER DEFAULT 0 CHECK (archived=0 OR archived=1)
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS booking_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS checklist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER DEFAULT 0 CHECK (done=0 OR done=1),
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT, 
      email_greeting TEXT,
      email_closing TEXT
    )
  `);

  const username = "admin";
  const plainPassword = "123";

  const hash = bcrypt.hashSync(plainPassword, 10);

  await db.execute({
    sql: `
      INSERT INTO users (username, password)
      SELECT ?, ?
      WHERE NOT EXISTS (
        SELECT 1 FROM users WHERE username = ?
      )
    `,
    args: [username, hash, username],
  });
  console.log("User created:", username);

}

export default db;