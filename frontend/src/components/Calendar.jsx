import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useEffect } from "react";


export default function Calendar({currentProject}) {

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const url = currentProject === 0 ? "http://localhost:3001/events" : `http://localhost:3001/events?project_id=${currentProject}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // make all events allDay = true
        const allDayEvents = data.map(event => ({ ...event, allDay: true, extendedProps: { project_id: event.project_id } }));
        setEvents(allDayEvents);
      })
      .catch(console.error);
  }, [currentProject]);

  function handleEventDrop(info) {
    fetch(`http://localhost:3001/events/${info.event.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start: info.event.startStr,
        end: info.event.endStr || null,
      })
    });
  }

  function handleEventReceive(info) {
    fetch("http://localhost:3001/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: info.event.title,
        start: info.event.startStr,
        end: info.event.endStr || null,
        project_id: currentProject === 0 ? null : currentProject,
      })
    })
      .then((res) => res.json())
      .then((newEvent) => {
        setEvents((prev) => [...prev, { ...newEvent, allDay: true, extendedProps: {project_id: currentProject} }]);
      })
      .then(console.log(`event added, title: ${info.event.title}, id: ${currentProject}`));
  }

  function handleEventResize(info) {
    fetch(`http://localhost:3001/events/${info.event.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start: info.event.startStr,
        end: info.event.endStr || null,
      })
    });
  }

  return (
    <div className="h-100">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
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