import express from "express";
import cors from "cors";
import db from "./db/database.js";
import { format } from "date-fns";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/events", (req, res) => {
    const events = db.prepare("SELECT * FROM events").all();

    // Format dates to YYYY-MM-DD
    const formattedEvents = events.map(event => ({
        ...event,
        start: format(new Date(event.start), "yyyy-MM-dd"),
        end: event.end ? format(new Date(event.end), "yyyy-MM-dd") : null
    }));

    res.json(formattedEvents);
});

app.post("/events", (req, res) => {
    const { title, start, end } = req.body;

    if (!title || !start) {
        return res.json({ error: "Title and start date are required" });
    }

    try {
        const stmt = db.prepare("INSERT INTO events (title, start, end) VALUES (?, ?, ?)");
        const result = stmt.run(title, start, end);

        res.json({ id: result.lastInsertRowid, title, start: format(new Date(start), "yyyy-MM-dd"), end: end ? format(new Date(end), "yyyy-MM-dd") : null });
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

        res.json({ id, start: format(new Date(start), "yyyy-MM-dd"), end: end ? format(new Date(end), "yyyy-MM-dd") : null });
    } catch (error) {
        console.error("Error updating event:", error);
        res.json({ error: "Failed to update event" });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
