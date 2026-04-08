import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {


    // check if user has enabled notifications
    let emailAddress;
    try {
        const notifSettings = await fetch("https://build-diary.vercel.app/api/notificationSettings");
        const data = await notifSettings.json();
        if (Boolean(data.notifications)) {
            emailAddress = data.emailAddress;
        }
    } catch (error) {
        console.error("Failed to fetch notification settings:", error);
        return res.status(200).json({ message: "Error checking notifications" });
    }

    if (!emailAddress) {
        return res.status(200).json({ message: "Notifications disabled" });
    }

    // check if any events on the next day
    let events;
    try {
        const eventsResult = await fetch("https://build-diary.vercel.app/api/events/tomorrow");
        events = await eventsResult.json();
    } catch (error) {
        console.error("Failed to fetch events:", error);
        return res.status(200).json({ message: "Error checking events" });
    }

    if (!events || events.length === 0) {
        return res.status(200).json({ message: "No events tomorrow" });
    }

    const eventList = events
        .map(e => `<li>${e.title} (${e.projectTitle || "No project"})</li>`)
        .join("");

    const today = new Date();
    const subjectDate = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();

    await resend.emails.send({
        from: "Build Diary <onboarding@resend.dev>",
        to: emailAddress,
        subject: "Coming Up: " + subjectDate,
        html: `
                <h3>Event/s Tomorrow</h3>
                <ul>${eventList}</ul>
                <br/>
                <p>You can disable these emails in notification settings.</p>
            `
    });

    res.status(200).json({ success: true });

}