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

// request logging for debugging
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

// user authentication methods

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    try {
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
        const result = await db.execute(
            "UPDATE users SET email_greeting = ?, email_closing = ?", 
            [greeting, closing]
        );
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
        const result = await db.execute(`
            SELECT events.*, projects.title AS projectTitle, projects.colour AS projectColour
            FROM events
            LEFT JOIN projects ON events.project_id = projects.id
            WHERE date(events.start) >= date('now')
            ORDER BY date(events.start) ASC
            LIMIT 1
        `);
        const events = rowsToObjects(result);
        const event = events[0];
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
            result = await db.execute(`
                SELECT events.*, projects.colour AS projectColour
                FROM events
                LEFT JOIN projects ON events.project_id = projects.id
                WHERE projects.archived = 0`
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

app.delete("/api/events/:id", async (req, res) => {
    const { id } = req.params;
    try {
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
app.get("/api/projects", async (req, res) => {
    const { archived } = req.query;
    try {
        let projects;
        if (archived === undefined) {
            const result = await db.execute("SELECT * FROM projects");
            projects = rowsToObjects(result);
        } else {
            const result = await db.execute(
                "SELECT * FROM projects WHERE archived = ?",
                [archived]
            );
            projects = rowsToObjects(result);
        }
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.json({ error: "Failed to fetch projects" });
    }
});

app.get("/api/projects/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.execute(
            "SELECT * FROM projects WHERE id = ?", [id]
        );
        const projects = rowsToObjects(result);
        const project = projects[0];

        if (!project) {
            return res.json({ error: "Project not found" });
        }

        res.json(project);
    } catch (error) {
        console.error("Error fetching project:", error);
        res.json({ error: "Failed to fetch project" });
    }
});

app.get("/api/projects/:id/templates", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.execute(`
            SELECT 
                booking_templates.id AS bookingId,
                booking_templates.title,
                CASE WHEN events.id IS NULL THEN 0 ELSE 1 END AS used
            FROM booking_templates
            LEFT JOIN events ON events.template_id = booking_templates.id AND events.project_id = booking_templates.project_id
            WHERE booking_templates.project_id = ?`, [id]
        );
        const templates = rowsToObjects(result);
        res.json(templates);
    } catch (error) {
        console.error("Error fetching project template bookings:", error);
        res.json({ error: "Failed to fetch project template bookings" });
    }
});

app.get("/api/projects/:id/checklist", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.execute(`
            SELECT id, title, done
            FROM checklist
            WHERE project_id = ?`, [id]
        );
        const checklist = rowsToObjects(result);
        res.json(checklist);
    } catch (error) {
        console.error("Error fetching project checklist:", error);
        res.json({ error: "Failed to fetch project checklist" });
    }
});

app.put("/api/projects/:projectId/checklist/:checklistId", async (req, res) => {
    const { projectId, checklistId } = req.params;
    const { done } = req.body;

    if (done === undefined) {
        return res.json({ error: "No done value given" });
    }

    try {
        const result = await db.execute(
            "UPDATE checklist SET done = ? WHERE id = ? AND project_id = ?",
            [done, checklistId, projectId]
        );

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
app.post("/api/projects", async (req, res) => {
    const { title, address, start_month, colour } = req.body;

    if (!title || !address || !start_month || !colour) {
        return res.json({ error: "All fields are required" });
    }

    try {
        const result = await db.execute(
            "INSERT INTO projects (title, address, start_month, colour) VALUES (?, ?, ?, ?)",
            [title, address, start_month, colour]
        )

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
                db.execute(
                    "INSERT INTO booking_templates (project_id, title) VALUES (?, ?)",
                    [projectId, title]
                )
            )
        );

        await Promise.all(
            checklistTemplate.map(task =>
                db.execute(
                    "INSERT INTO checklist (project_id, title) VALUES (?, ?)",
                    [projectId, task]
                )
            )
        );

        res.json({ id: projectId, title, address, start_month, colour });
    } catch (error) {
        console.error("Error creating project:", error);
        res.json({ error: "Failed to insert project" });
    }
});

app.put("/api/projects/:id", async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
        return res.json({ error: "No fields given" });
    }

    const setClauses = Object.keys(updates).map(key => `${key} = ?`).join(", ");
    const values = Object.values(updates);

    try {
        const result = await db.execute(
            `UPDATE projects SET ${setClauses} WHERE id = ?`,
            [...values, id]
        );

        if (result.rowsAffected === 0) {
            return res.json({ error: "Project not found" });
        }

        res.json({ id, ...updates });
    } catch (error) {
        console.error("Error updating project: ", error);
        res.json({ error: "Failed to update project" });
    }
});

app.delete("/api/projects/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.execute(
            "DELETE FROM projects WHERE id = ?", [id]
        );

        if (result.rowsAffected === 0) {
            return res.json({ error: "Project not found" });
        }

        res.json({ deletedId: id });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.json({ error: "Failed to delete project" });
    }
});



// for all unhandled errors (always return json)
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

export default app;