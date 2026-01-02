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
    title TEXT NOT NULL UNIQUE
  )
`).run();

// seed booking templates from array

db.prepare(`
  INSERT OR IGNORE INTO booking_templates (title) VALUES
    ('Excavator'),
    ('Retaining walls'),
    ('Site set out'),
    ('Plumber drainer'),
    ('Plumber rough in'),
    ('Plumber fit off'),
    ('Bobcat'),
    ('Pier inspection'),
    ('Concreter'),
    ('Termite protection'),
    ('Slab inspection'),
    ('Concrete pump'),
    ('Electrician U/Power'),
    ('Electrician rough in'),
    ('Electrician fit off'),
    ('Electrician AC'),
    ('Crane truss lift'),
    ('Frame inspection'),
    ('Edge protection'),
    ('Carpenter frame'),
    ('Carpenter rough in'),
    ('Carpenter soffits'),
    ('Carpenter fix out'),
    ('Carpenter finish out'),
    ('Bricklayer'),
    ('Garage door'),
    ('Tiler'),
    ('Painter'),
    ('Concrete kerb cut'),
    ('Drive/concreter'),
    ('Dividing fencing'),
    ('Fencing'),
    ('Bobcat clean'),
    ('TV antenna'),
    ('Garden kerbing'),
    ('Insulation/ceiling'),
    ('Final inspection'),
    ('Cleaning'),
    ('Silicon sealer');  
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS project_template_bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    used INTEGER DEFAULT 0 CHECK (used=0 OR used=1),
    template_id INTEGER REFERENCES booking_templates(id),
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE (project_id, template_id)
  )
`).run();
// UNIQUE constraint ensures the project_id and template_id combination can't be repeated

db.prepare(`
  CREATE TABLE IF NOT EXISTS checklist_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL UNIQUE
  )
`).run();

// seed checklist templates
db.prepare(`
  INSERT OR IGNORE INTO checklist_templates (title) VALUES
    ('Retaining walls order'),
    ('Crusher dust'),
    ('Concrete'),
    ('Steel/reo'),
    ('Pods'),
    ('WC hire'),
    ('Bolts tie down'),
    ('Gas fitter rough in'),
    ('Gas fitter fit off'),
    ('Phone rough in'),
    ('Hardware: rough in'),
    ('Hardware: fit off'),
    ('Hardware: FC'),
    ('Hardware: sink'),
    ('Hardware: PC'),
    ('Hardware: steel lintels'),
    ('Bricks'),
    ('Lights'),
    ('Water tank and pump'),
    ('Tile order'),
    ('Turf'),
    ('Landscaping'),
    ('Disconnect power'),
    ('Gas connection'),
    ('Oven'),
    ('Cooktop'),
    ('White goods'),
    ('Book gas fitter'),
    ('Hand over folder'),
    ('NBN connection'),
    ('Covenant bond refund');
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS checklist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    done INTEGER DEFAULT 0 CHECK (done=0 OR done=1),
    template_id INTEGER REFERENCES checklist_templates(id),
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE (project_id, template_id)
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