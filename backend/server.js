import express from "express";
import cors from "cors";
import db from "./database/initDb.js";
import bcrypt from "bcrypt";

const app = express();

app.use(cors());
app.use(express.json());

// user authentication methods

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    try {
        const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
        const user = stmt.get(username);

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

app.get("/settings", (req, res) => {
    try {
        const stmt = db.prepare("SELECT email_greeting AS emailGreeting, email_closing AS emailClosing FROM users");
        const emailTemplate = stmt.get();

        res.json(emailTemplate);
    } catch (error) {
        console.error("Error fetching email template:", error);
        res.json({ error: "Failed to fetch email template" });
    }
});

app.put("/settings", (req, res) => {
    const { greeting, closing } = req.body;

    try {
        const stmt = db.prepare("UPDATE users SET email_greeting = ?, email_closing = ?");
        const result = stmt.run(greeting, closing);

        if (result.changes === 0) {
            return res.json({ error: "User not found" });
        }

        res.json({ greeting, closing });
    } catch (error) {
        console.error("Error updating email template:", error);
        res.json({ error: "Failed to update email greeting and closing" });
    }
});

// events table methods
app.get("/events", (req, res) => {
    const projectId = req.query.project_id;
    try {
        let events;
        if (projectId) { // if project_id is not null or zero
            const stmt = db.prepare(`
                SELECT events.*, projects.colour AS projectColour, projects.address AS address
                FROM events
                LEFT JOIN projects ON events.project_id = projects.id
                WHERE events.project_id = ?
            `);
            events = stmt.all(projectId); // projectId parameter goes into stmt placeholder (?)
        } else {
            const stmt = db.prepare(`
                SELECT events.*, projects.colour AS projectColour
                FROM events
                LEFT JOIN projects ON events.project_id = projects.id
            `);
            events = stmt.all();
        }
        res.json(events);
    } catch (err) {
        console.error(err);
        res.json({ error: "Failed to fetch events" });
    }
});

app.get("/events/next", (req, res) => {
    try {
        let event;
        const stmt = db.prepare(`
            SELECT events.*, projects.title AS projectTitle, projects.colour AS projectColour
            FROM events
            LEFT JOIN projects ON events.project_id = projects.id
            WHERE date(events.start) >= date('now')
            ORDER BY date(events.start) ASC
            LIMIT 1
        `);
        event = stmt.get();
        res.json(event);
    } catch (err) {
        console.error(err);
        res.json({ error: "Failed to fetch next event" });
    }
});

app.get("/events/:id", (req, res) => {
    const { id } = req.params;

    try {
        const stmt = db.prepare(`
            SELECT events.*, projects.colour AS projectColour, projects.address AS address
            FROM events
            LEFT JOIN projects ON events.project_id = projects.id
            WHERE events.id = ?`);
        const thisEvent = stmt.get(id);

        if (!thisEvent) {
            return res.json({ error: "Event not found" });
        }

        res.json(thisEvent);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.json({ error: "Failed to fetch event" });
    }
});

app.post("/events", (req, res) => {
    const { title, start, end, project_id, template_id } = req.body;

    if (!title || !start) {
        return res.json({ error: "Title and start date are required" });
    }

    try {
        const stmt = db.prepare("INSERT INTO events (title, start, end, project_id, template_id) VALUES (?, ?, ?, ?, ?)");
        const result = stmt.run(title, start, end, project_id, template_id);

        res.json({ id: result.lastInsertRowid, title, start, end, project_id, template_id });
    } catch (error) {
        console.error("Error inserting event:", error);
        res.json({ error: "Failed to insert event" });
    }
});

app.put("/events/:id", (req, res) => {
    const { id } = req.params;
    const { start, end } = req.body;

    if (!start) {
        return res.json({ error: "Start date is required" });
    }

    try {
        const stmt = db.prepare("UPDATE events SET start = ?, end = ? WHERE id = ?");
        const result = stmt.run(start, end, id);

        if (result.changes === 0) {
            return res.json({ error: "Event not found" });
        }

        res.json({ id, start, end });
    } catch (error) {
        console.error("Error updating event:", error);
        res.json({ error: "Failed to update event" });
    }
});

app.delete("/events/:id", (req, res) => {
    const { id } = req.params;
    try {
        const stmt = db.prepare("DELETE FROM events WHERE id = ?");
        const result = stmt.run(id);

        if (result.changes === 0) {
            return res.json({ error: "Event not found" });
        }

        res.json({ deletedId: id });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.json({ error: "Failed to delete event" });
    }
});


// projects table methods
app.get("/projects", (req, res) => {
    const { archived } = req.query;
    try {
        let projects;
        if (archived === undefined) {
            projects = db.prepare("SELECT * FROM projects").all();
        } else {
            const stmt = db.prepare("SELECT * FROM projects WHERE archived = ?");
            projects = stmt.all(archived);
        }
        res.json(projects);
    } catch {
        console.error(err);
        res.json({ error: "Failed to fetch projects" });
    }
});

app.get("/projects/:id", (req, res) => {
    const { id } = req.params;

    try {
        const stmt = db.prepare("SELECT * FROM projects WHERE id = ?");
        const project = stmt.get(id);

        if (!project) {
            return res.json({ error: "Project not found" });
        }

        res.json(project);
    } catch (error) {
        console.error("Error fetching project:", error);
        res.json({ error: "Failed to fetch project" });
    }
});

app.get("/projects/:id/templates", (req, res) => {
    const { id } = req.params;

    try {
        const stmt = db.prepare(`
            SELECT 
                booking_templates.id AS bookingId,
                booking_templates.title,
                CASE WHEN events.id IS NULL THEN 0 ELSE 1 END AS used
            FROM booking_templates
            LEFT JOIN events ON events.template_id = booking_templates.id AND events.project_id = booking_templates.project_id
            WHERE booking_templates.project_id = ?
        `);
        const templates = stmt.all(id);
        res.json(templates);
    } catch (error) {
        console.error("Error fetching project template bookings:", error);
        res.json({ error: "Failed to fetch project template bookings" });
    }
});

app.get("/projects/:id/checklist", (req, res) => {
    const { id } = req.params;

    try {
        const stmt = db.prepare(`
            SELECT id, title, done
            FROM checklist
            WHERE checklist.project_id = ?
        `);
        const checklist = stmt.all(id);
        res.json(checklist);
    } catch (error) {
        console.error("Error fetching project checklist:", error);
        res.json({ error: "Failed to fetch project checklist" });
    }
});

app.put("/projects/:projectId/checklist/:checklistId", (req, res) => {
    const { projectId, checklistId } = req.params;
    const { done } = req.body;

    if (done === undefined) {
        return res.json({ error: "No done value given" });
    }

    try {
        const stmt = db.prepare("UPDATE checklist SET done = ? WHERE id = ? AND project_id = ?");
        const result = stmt.run(done, checklistId, projectId);

        if (result.changes === 0) {
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
app.post("/projects", (req, res) => {
    const { title, address, start_month, colour } = req.body;

    if (!title || !address || !start_month || !colour) {
        return res.json({ error: "All fields are required" });
    }

    try {
        const stmt = db.prepare("INSERT INTO projects (title, address, start_month, colour) VALUES (?, ?, ?, ?)");
        const result = stmt.run(title, address, start_month, colour);

        const projectId = result.lastInsertRowid;

        // insert new sets of template bookings and checklist tasks

        const insertBookingTemplate = db.prepare(
            "INSERT INTO booking_templates (project_id, title) VALUES (?, ?)"
        );
        for (const title of bookingsTemplate) {
            insertBookingTemplate.run(projectId, title);
        }

        const insertChecklistTemplate = db.prepare(
            "INSERT INTO checklist (project_id, title) VALUES (?, ?)"
        );
        for (const task of checklistTemplate) {
            insertChecklistTemplate.run(projectId, task);
        }

        res.json({ id: projectId, title, address, start_month, colour });
    } catch (error) {
        console.error("Error creating project:", error);
        res.json({ error: "Failed to insert project" });
    }
});

app.put("/projects/:id", (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
        return res.json({ error: "No fields given" });
    }

    const setClauses = Object.keys(updates).map(key => `${key} = ?`).join(", ");
    const values = Object.values(updates);

    try {
        const stmt = db.prepare(`UPDATE projects SET ${setClauses} WHERE id = ?`);
        const result = stmt.run(...values, id);

        if (result.changes === 0) {
            return res.json({ error: "Project not found" });
        }

        res.json({ id, ...updates });
    } catch (error) {
        console.error("Error updating project: ", error);
        res.json({ error: "Failed to update project" });
    }
});

app.delete("/projects/:id", (req, res) => {
    const { id } = req.params;
    try {
        const stmt = db.prepare("DELETE FROM projects WHERE id = ?");
        const result = stmt.run(id);

        if (result.changes === 0) {
            return res.json({ error: "Project not found" });
        }

        res.json({ deletedId: id });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.json({ error: "Failed to delete project" });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
