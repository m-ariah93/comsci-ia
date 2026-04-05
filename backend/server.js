console.log("ENV CHECK:", {
    url: process.env.TURSO_DATABASE_URL,
    token: process.env.TURSO_AUTH_TOKEN ? "present" : "missing"
});

import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import "dotenv/config";
import db, { initDb } from "./database/initDb.js";

const app = express();

// helper function - convert arrays from db to objects using column names
function rowsToObjects(result) {
    return result.rows.map(row => {
        const obj = {};
        result.columns.forEach((col, i) => {
            obj[col] = row[i];
        });
        return obj;
    });
}

// Request logging for debugging
app.use((req, res, next) => {
    console.log(`[API] ${req.method} ${req.path}`);
    next();
});

app.use(cors());
app.use(express.json());

// initialise database lazily on first request
let dbInitPromise = null;

// ensure db is ready before handling requests
app.use(async (req, res, next) => {
    if (!dbInitPromise) {
        dbInitPromise = initDb()
            .then(() => {
                console.log("Database initialised successfully");
                return true;
            })
            .catch((error) => {
                console.error("Database initialisation failed:", error);
                throw error;
            });
    }

    try {
        await dbInitPromise;
        next();
    } catch (error) {
        res.status(500).json({ error: "Database initialisation failed: " + error.message });
    }
});

app.get("/", (req, res) => {
    res.json({ message: "API root is working", time: Date.now() });
});

app.get("/index", (req, res) => {
    res.json({ message: "/index route is working", time: Date.now() });
});

app.get("/api/index", (req, res) => {
    res.json({ message: "/api/index route is working", time: Date.now() });
});

// debug route to test vercel routing
app.get("/api/test", (req, res) => {
    res.json({ message: "express app is working" });
});


// user authentication methods

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
        // const user = stmt.get(username);
        // const result = await db.execute({
        //     sql: "SELECT * FROM users WHERE username = ?",
        //     args: [username],
        // });
        const result = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
        const user = result.rows[0];

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const passwordMatches = bcrypt.compareSync(password, user.password);

        if (!passwordMatches) {
            return res.json({ success: false, message: "Incorrect password" });
        }

        // successful login
        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.json({ success: false, message: "Server error" });
    }

});

// user settings

app.get("/api/settings", async (req, res) => {
    try {
        // const stmt = db.prepare("SELECT email_greeting AS emailGreeting, email_closing AS emailClosing FROM users");
        // const emailTemplate = stmt.get();
        const result = await db.execute(
            "SELECT email_greeting AS emailGreeting, email_closing AS emailClosing FROM users"
        );
        const emailTemplate = result.rows[0];
        res.json({
            emailGreeting: emailTemplate[0],
            emailClosing: emailTemplate[1]
        });
    } catch (error) {
        console.error("Error fetching email template:", error);
        res.json({ error: "Failed to fetch email template" });
    }
});

app.put("/api/settings", async (req, res) => {
    const { greeting, closing } = req.body;

    try {
        // const stmt = db.prepare("UPDATE users SET email_greeting = ?, email_closing = ?");
        // const result = stmt.run(greeting, closing);
        // const result = await db.execute({
        //     sql: "UPDATE users SET email_greeting = ?, email_closing = ?",
        //     args: [greeting, closing],
        // });

        const result = await db.execute("UPDATE users SET email_greeting = ?, email_closing = ?", [greeting, closing]);

        if (result.rowsAffected === 0) {
            return res.json({ error: "User not found" });
        }

        res.json({ greeting, closing });
    } catch (error) {
        console.error("Error updating email template:", error);
        res.json({ error: "Failed to update email greeting and closing" });
    }
});

// events table methods
app.get("/api/events/next", async (req, res) => {
    try {
        let event;
        // const stmt = db.prepare(`
        //     SELECT events.*, projects.title AS projectTitle, projects.colour AS projectColour
        //     FROM events
        //     LEFT JOIN projects ON events.project_id = projects.id
        //     WHERE date(events.start) >= date('now')
        //     ORDER BY date(events.start) ASC
        //     LIMIT 1
        // `);
        // event = stmt.get();
        const result = await db.execute(`
            SELECT events.*, projects.title AS projectTitle, projects.colour AS projectColour
            FROM events
            LEFT JOIN projects ON events.project_id = projects.id
            WHERE date(events.start) >= date('now')
            ORDER BY date(events.start) ASC
            LIMIT 1
        `);
        const events = rowsToObjects(result);
        event = events[0];
        res.json(event);
    } catch (err) {
        console.error(err);
        res.json({ error: "Failed to fetch next event" });
    }
});

app.get("/api/events", async (req, res) => {
    const projectId = req.query.project_id;
    try {
        let result;
        if (projectId) { // if project_id is not null or zero
            result = await db.execute(`
                SELECT events.*, projects.colour AS projectColour, projects.address AS address
                FROM events
                LEFT JOIN projects ON events.project_id = projects.id
                WHERE events.project_id = ?`,
                [projectId]
            ); // projectId parameter goes into stmt placeholder (?)

        } else {
            // const stmt = db.prepare(`
            //     SELECT events.*, projects.colour AS projectColour
            //     FROM events
            //     LEFT JOIN projects ON events.project_id = projects.id
            // `);
            // events = stmt.all();
            // const result = await db.execute(`
            //     SELECT events.*, projects.colour AS projectColour
            //     FROM events
            //     LEFT JOIN projects ON events.project_id = projects.id
            // `);

            result = await db.execute(`
                SELECT events.*, projects.colour AS projectColour
                FROM events
                LEFT JOIN projects ON events.project_id = projects.id`
            );

        }
        const events = rowsToObjects(result);
        res.json(events);
    } catch (err) {
        console.error(err);
        res.json({ error: "Failed to fetch events" });
    }
});

app.get("/api/events/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // const stmt = db.prepare(`
        //     SELECT events.*, projects.colour AS projectColour, projects.address AS address
        //     FROM events
        //     LEFT JOIN projects ON events.project_id = projects.id
        //     WHERE events.id = ?`);
        // const thisEvent = stmt.get(id);

        const result = await db.execute(`
            SELECT events.*, projects.colour AS projectColour, projects.address AS address
            FROM events
            LEFT JOIN projects ON events.project_id = projects.id
            WHERE events.id = ?`, [id]
        );
        const events = rowsToObjects(result);
        const thisEvent = events[0];

        if (!thisEvent) {
            return res.json({ error: "Event not found" });
        }

        res.json(thisEvent);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.json({ error: "Failed to fetch event" });
    }
});

app.post("/api/events", async (req, res) => {
    const { title, start, end, project_id, template_id } = req.body;

    if (!title || !start) {
        return res.json({ error: "Title and start date are required" });
    }

    try {
        // const stmt = db.prepare("INSERT INTO events (title, start, end, project_id, template_id) VALUES (?, ?, ?, ?, ?)");
        // const result = stmt.run(title, start, end, project_id, template_id);
        const result = await db.execute(`
            INSERT INTO events (title, start, end, project_id, template_id)
            VALUES (?, ?, ?, ?, ?)`,
            [title, start, end, project_id, template_id]
        );

        res.json({ id: result.lastInsertRowid, title, start, end, project_id, template_id });
    } catch (error) {
        console.error("Error inserting event:", error);
        res.json({ error: "Failed to insert event" });
    }
});

app.put("/api/events/:id", async (req, res) => {
    const { id } = req.params;
    const { start, end } = req.body;

    if (!start) {
        return res.json({ error: "Start date is required" });
    }

    try {
        // const stmt = db.prepare("UPDATE events SET start = ?, end = ? WHERE id = ?");
        // const result = stmt.run(start, end, id);
        const result = await db.execute(
            "UPDATE events SET start = ?, end = ? WHERE id = ?",
            [start, end, id]
        )

        if (result.rowsAffected === 0) {
            return res.json({ error: "Event not found" });
        }

        res.json({ id, start, end });
    } catch (error) {
        console.error("Error updating event:", error);
        res.json({ error: "Failed to update event" });
    }
});

app.delete("/events/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // const stmt = db.prepare("DELETE FROM events WHERE id = ?");
        // const result = stmt.run(id);
        const result = await db.execute(
            "DELETE FROM events WHERE id = ?", [id]
        );

        if (result.rowsAffected === 0) {
            return res.json({ error: "Event not found" });
        }

        res.json({ deletedId: id });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.json({ error: "Failed to delete event" });
    }
});


// projects table methods
app.get("/projects", async (req, res) => {
    const { archived } = req.query;
    try {
        let projects;
        if (archived === undefined) {
            // projects = db.prepare("SELECT * FROM projects").all();
            const result = await db.execute("SELECT * FROM projects");
            projects = result.rows;
        } else {
            // const stmt = db.prepare("SELECT * FROM projects WHERE archived = ?");
            // projects = stmt.all(archived);
            const result = await db.execute({
                sql: "SELECT * FROM projects WHERE archived = ?",
                args: [archived],
            });
            projects = result.rows;
        }
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.json({ error: "Failed to fetch projects" });
    }
});

app.get("/projects/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // const stmt = db.prepare("SELECT * FROM projects WHERE id = ?");
        // const project = stmt.get(id);
        const result = await db.execute({
            sql: "SELECT * FROM projects WHERE id = ?",
            args: [id],
        });
        const project = result.rows[0];

        if (!project) {
            return res.json({ error: "Project not found" });
        }

        res.json(project);
    } catch (error) {
        console.error("Error fetching project:", error);
        res.json({ error: "Failed to fetch project" });
    }
});

app.get("/projects/:id/templates", async (req, res) => {
    const { id } = req.params;

    try {
        // const stmt = db.prepare(`
        //     SELECT 
        //         booking_templates.id AS bookingId,
        //         booking_templates.title,
        //         CASE WHEN events.id IS NULL THEN 0 ELSE 1 END AS used
        //     FROM booking_templates
        //     LEFT JOIN events ON events.template_id = booking_templates.id AND events.project_id = booking_templates.project_id
        //     WHERE booking_templates.project_id = ?
        // `);
        // const templates = stmt.all(id);
        const result = await db.execute({
            sql: `
                SELECT 
                    booking_templates.id AS bookingId,
                    booking_templates.title,
                    CASE WHEN events.id IS NULL THEN 0 ELSE 1 END AS used
                FROM booking_templates
                LEFT JOIN events ON events.template_id = booking_templates.id AND events.project_id = booking_templates.project_id
                WHERE booking_templates.project_id = ?
            `,
            args: [id],
        });
        const templates = result.rows;
        res.json(templates);
    } catch (error) {
        console.error("Error fetching project template bookings:", error);
        res.json({ error: "Failed to fetch project template bookings" });
    }
});

app.get("/projects/:id/checklist", async (req, res) => {
    const { id } = req.params;

    try {
        // const stmt = db.prepare(`
        //     SELECT id, title, done
        //     FROM checklist
        //     WHERE project_id = ?
        // `);
        // const checklist = stmt.all(id);
        const result = await db.execute({
            sql: `
                SELECT id, title, done
                FROM checklist
                WHERE project_id = ?
            `,
            args: [id],
        });
        const checklist = result.rows;
        res.json(checklist);
    } catch (error) {
        console.error("Error fetching project checklist:", error);
        res.json({ error: "Failed to fetch project checklist" });
    }
});

app.put("/projects/:projectId/checklist/:checklistId", async (req, res) => {
    const { projectId, checklistId } = req.params;
    const { done } = req.body;

    if (done === undefined) {
        return res.json({ error: "No done value given" });
    }

    try {
        // const stmt = db.prepare("UPDATE checklist SET done = ? WHERE id = ? AND project_id = ?");
        // const result = stmt.run(done, checklistId, projectId);
        const result = await db.execute({
            sql: "UPDATE checklist SET done = ? WHERE id = ? AND project_id = ?",
            args: [done, checklistId, projectId],
        });

        if (result.rowsAffected === 0) {
            return res.json({ error: "Checklist not found" });
        }
        console.log("checklist value set to", done);


        res.json({ projectId, checklistId, done });
    } catch (error) {
        console.error("Error updating done value of checklist:", error);
        res.json({ error: "Failed to update checklist" });
    }
});

import bookingsTemplate from "./templates/bookingsTemplate.js";
import checklistTemplate from "./templates/checklistTemplate.js";
app.post("/projects", async (req, res) => {
    const { title, address, start_month, colour } = req.body;

    if (!title || !address || !start_month || !colour) {
        return res.json({ error: "All fields are required" });
    }

    try {
        // const stmt = db.prepare("INSERT INTO projects (title, address, start_month, colour) VALUES (?, ?, ?, ?)");
        // const result = stmt.run(title, address, start_month, colour);
        const result = await db.execute({
            sql: "INSERT INTO projects (title, address, start_month, colour) VALUES (?, ?, ?, ?)",
            args: [title, address, start_month, colour],
        })

        const projectId = Number(result.lastInsertRowid);

        // insert new sets of template bookings and checklist tasks

        // const insertBookingTemplate = db.prepare(
        //     "INSERT INTO booking_templates (project_id, title) VALUES (?, ?)"
        // );
        // for (const title of bookingsTemplate) {
        //     insertBookingTemplate.run(projectId, title);
        // }

        // for (const title of bookingsTemplate) {
        //     await db.execute({
        //         sql: "INSERT INTO booking_templates (project_id, title) VALUES (?, ?)",
        //         args: [projectId, title],
        //     });
        // }

        // const insertChecklistTemplate = db.prepare(
        //     "INSERT INTO checklist (project_id, title) VALUES (?, ?)"
        // );
        // for (const task of checklistTemplate) {
        // insertChecklistTemplate.run(projectId, task);
        // }

        // for (const task of checklistTemplate) {
        //     await db.execute({
        //         sql: "INSERT INTO checklist (project_id, title) VALUES (?, ?)",
        //         args: [projectId, task],
        //     });
        // }

        // parallel inserts (faster than for loops)

        await Promise.all(
            bookingsTemplate.map(title =>
                db.execute({
                    sql: "INSERT INTO booking_templates (project_id, title) VALUES (?, ?)",
                    args: [projectId, title],
                })
            )
        );

        await Promise.all(
            checklistTemplate.map(task =>
                db.execute({
                    sql: "INSERT INTO checklist (project_id, title) VALUES (?, ?)",
                    args: [projectId, task],
                })
            )
        );

        res.json({ id: projectId, title, address, start_month, colour });
    } catch (error) {
        console.error("Error creating project:", error);
        res.json({ error: "Failed to insert project" });
    }
});

app.put("/projects/:id", async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
        return res.json({ error: "No fields given" });
    }

    const setClauses = Object.keys(updates).map(key => `${key} = ?`).join(", ");
    const values = Object.values(updates);

    try {
        // const stmt = db.prepare(`UPDATE projects SET ${setClauses} WHERE id = ?`);
        // const result = stmt.run(...values, id);

        const result = await db.execute({
            sql: `UPDATE projects SET ${setClauses} WHERE id = ?`,
            args: [...values, id],
        });

        if (result.rowsAffected === 0) {
            return res.json({ error: "Project not found" });
        }

        res.json({ id, ...updates });
    } catch (error) {
        console.error("Error updating project: ", error);
        res.json({ error: "Failed to update project" });
    }
});

app.delete("/projects/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // const stmt = db.prepare("DELETE FROM projects WHERE id = ?");
        // const result = stmt.run(id);
        const result = await db.execute({
            sql: "DELETE FROM projects WHERE id = ?",
            args: [id],
        });

        if (result.rowsAffected === 0) {
            return res.json({ error: "Project not found" });
        }

        res.json({ deletedId: id });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.json({ error: "Failed to delete project" });
    }
});

// const PORT = 3001;
// app.listen(PORT, () => {
//     console.log(`Backend running on http://localhost:${PORT}`);
// });


// Catch-all error handler for unhandled errors (always return JSON)
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

export default app;