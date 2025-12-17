import express from "express";
import cors from "cors";
import db from "./db/database.js";

const app = express();

app.use(cors());
app.use(express.json());


// events table methods
app.get("/events", (req, res) => {
    const events = db.prepare("SELECT * FROM events").all();
    res.json(events);
});

app.post("/events", (req, res) => {
    const { title, start, end } = req.body;

    if (!title || !start) {
        return res.json({ error: "Title and start date are required" });
    }

    try {
        const stmt = db.prepare("INSERT INTO events (title, start, end) VALUES (?, ?, ?)");
        const result = stmt.run(title, start, end);

        res.json({ id: result.lastInsertRowid, title, start, end });
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


// projects table methods
app.get("/projects", (req, res) => {
    const projects = db.prepare("SELECT * FROM projects").all();
    res.json(projects);
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

app.post("/projects", (req, res) => {
    const { title, address, startMonth } = req.body;

    if (!title || !address || !startMonth) {
        return res.json({ error: "All fields are required" });
    }

    try {
        const stmt = db.prepare("INSERT INTO projects (title, address, startMonth) VALUES (?, ?, ?)");
        const result = stmt.run(title, address, startMonth);

        res.json({ id: result.lastInsertRowid, title, address, startMonth });
    } catch (error) {
        console.error("Error inserting event:", error);
        res.json({ error: "Failed to insert event" });
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

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
