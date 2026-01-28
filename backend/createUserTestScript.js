import db from "./database/initDb.js";
import bcrypt from "bcrypt";

const username = "admin";
const plainPassword = "123";

const hash = bcrypt.hashSync(plainPassword, 10);

db.prepare(
  "INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)"
).run(username, hash);

console.log("User created:", username);
