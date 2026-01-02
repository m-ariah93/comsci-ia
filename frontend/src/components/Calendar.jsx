import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { useState, useEffect } from "react";


export default function Calendar({ currentProjectId, currentProject, keyBookingsRef, onEventsChanged }) {

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
    const templateId = info.draggedEl.dataset.templateId;
    info.event.setExtendedProp("templateId", templateId); // extended prop for dragging back into list

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
      .then(() => {
        return fetch(`http://localhost:3001/projects/${currentProjectId}/bookings/${templateId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            used: 1,
          })
        });
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

  function isOverElement(jsEvent, ref) {
    const rectangle = ref.current?.getBoundingClientRect();
    if (!rectangle) return false;

    return (
      jsEvent.clientX >= rectangle.left &&
      jsEvent.clientX <= rectangle.right &&
      jsEvent.clientY >= rectangle.top &&
      jsEvent.clientY <= rectangle.bottom
    );
  }

  function handleEventDragStop(info) {
    if (isOverElement(info.jsEvent, keyBookingsRef)) {
      const templateId = info.event.extendedProps.templateId;
      console.log("template id is ", templateId);
      const eventId = info.event.id;

      info.event.remove();

      fetch(`http://localhost:3001/events/${eventId}`, {
        // delete event from events table
        method: "DELETE",
      })
        .then(() => {
          // make template booking unused
          return fetch(
            `http://localhost:3001/projects/${currentProjectId}/bookings/${templateId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ used: 0 }),
            }
          );
        })
        .then(handleEventsChanged)
        .then(console.log(`event removed, title: ${info.event.title}, id: ${currentProjectId}`));
    }
  }

  return (
    <div className="h-100">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        height="100%"
        firstDay={1}
        droppable={true}
        editable={true}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridWeek,dayGridMonth,listMonth'
        }}
        events={events}
        eventDrop={handleEventDrop}
        eventReceive={handleEventReceive}
        eventResize={handleEventResize}
        eventDragStop={handleEventDragStop}
        eventColor={currentProject ? currentProjectColour : null}
        validRange={currentProject ? { start: `${currentProject.start_month}-01` } : null}
      />
    </div>

  );

}