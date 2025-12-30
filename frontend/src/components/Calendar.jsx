import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useEffect } from "react";


export default function Calendar({ currentProjectId, currentProject, onEventsChanged }) {

  const [events, setEvents] = useState([]);

  const [currentProjectColour, setCurrentProjectColour] = useState(null);

  // store current project colour for draggable events
  useEffect(() => {
    fetch(`http://localhost:3001/projects/${currentProjectId}`)
      .then(res => res.json())
      .then(data => {
        setCurrentProjectColour(data.colour);
      });
  }, [currentProjectId]);

  useEffect(() => {
    const url = currentProjectId === 0 ? "http://localhost:3001/events" : `http://localhost:3001/events?project_id=${currentProjectId}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // make all events allDay = true
        const allDayEvents = data.map(event => ({ ...event, allDay: true, backgroundColor: event.projectColour, borderColor: event.projectColour, extendedProps: { project_id: event.project_id } }));
        setEvents(allDayEvents);
      })
      .catch(console.error);
  }, [currentProjectId]);

  function handleEventDrop(info) {
    fetch(`http://localhost:3001/events/${info.event.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start: info.event.startStr,
        end: info.event.endStr || null,
      })
    })
      .then(handleEventsChanged);
  }

  function handleEventReceive(info) {
    fetch("http://localhost:3001/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: info.event.title,
        start: info.event.startStr,
        end: info.event.endStr || null,
        project_id: currentProjectId === 0 ? null : currentProjectId,
      })
    })
      .then((res) => res.json())
      .then((newEvent) => {
        setEvents((prev) => [...prev, { ...newEvent, allDay: true, extendedProps: { project_id: currentProjectId } }]);
      })
      .then(handleEventsChanged)
      .then(console.log(`event added, title: ${info.event.title}, id: ${currentProjectId}`));
  }

  function handleEventResize(info) {
    fetch(`http://localhost:3001/events/${info.event.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start: info.event.startStr,
        end: info.event.end - info.event.start === (1000 * 60 * 60 * 24) ? null : info.event.endStr || null
      })
    })
      .then(handleEventsChanged);
  }

  const handleEventsChanged = () => {
    if (onEventsChanged) onEventsChanged();
  };


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
        eventColor={currentProject ? currentProjectColour : null}
        validRange={currentProject ? { start: `${currentProject.startMonth}-01` } : null}
      />
    </div>

  );

}