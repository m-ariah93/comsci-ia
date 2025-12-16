import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useEffect } from "react";


export default function Calendar() {

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
      })
      .catch(console.error);
  }, []);

  function handleEventDrop(info) {
    fetch(`http://localhost:3001/events/${info.event.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // start: info.event.start.toISOString().split("T")[0],
        // end: info.event.end ? info.event.end.toISOString().split("T")[0] : null,
        start: info.event.start.toISOString(),
        end: info.event.end ? info.event.end.toISOString() : null,
      })
    });
  }

  function handleEventReceive(info) {
    fetch("http://localhost:3001/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: info.event.title,
        // start: info.event.start.toISOString().split("T")[0],
        // end: info.event.end ? info.event.end.toISOString().split("T")[0] : null,
        start: info.event.start.toISOString(),
        end: info.event.end ? info.event.end.toISOString() : null,
      })
    })
      .then((res) => res.json())
      .then((newEvent) => {
        setEvents((prev) => [...prev, newEvent]);
      });
  }

  function handleEventResize(info) {
    fetch(`http://localhost:3001/events/${info.event.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // start: info.event.start.toISOString().split("T")[0],
        // end: info.event.end ? info.event.end.toISOString().split("T")[0] : null,
        start: info.event.start.toISOString(),
        end: info.event.end ? info.event.end.toISOString() : null,
      })
    });
  }

  return (
    <div className="h-100">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        // aspectRatio={1.5}
        height="100%"
        firstDay={1}
        droppable={true}
        editable={true}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridWeek,dayGridMonth'
        }}
        events={events}
        eventDrop={handleEventDrop}
        eventReceive={handleEventReceive}
        eventResize={handleEventResize}
      />
    </div>

  );

}