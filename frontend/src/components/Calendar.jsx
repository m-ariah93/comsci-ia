import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { useState, useEffect } from "react";


export default function Calendar({ currentProjectId, currentProject, keyBookingsRef, events, onEventsChanged }) {

  useEffect(() => {
    handleEventsChanged();
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
    fetch("http://localhost:3001/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: info.event.title,
        start: info.event.startStr,
        end: info.event.endStr || null,
        project_id: currentProjectId === 0 ? null : currentProjectId,
        template_id: templateId
      })
    })
      .then((res) => res.json())
      .then(handleEventsChanged)
      .then(console.log(`event added, title: ${info.event.title}, project id: ${currentProjectId}`));
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

  function handleEventsChanged() { // wrapper function
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
      const eventId = info.event.id;

      info.event.remove();

      fetch(`http://localhost:3001/events/${eventId}`, {
        // delete event from events table
        method: "DELETE",
      })
        .then(handleEventsChanged)
        .then(console.log(`event removed, title: ${info.event.title}, id: ${currentProjectId}`));
    }
  }

  function handleEventClick(info) {
    const existingPopover = bootstrap.Popover.getInstance(info.el);
    if (existingPopover) {
      existingPopover.dispose();
    }

    const confirmationButton = document.createElement("button");
    confirmationButton.className = "btn btn-secondary btn-sm me-2";
    confirmationButton.textContent = "Request confirmation";

    // todo: make mailto link

    // button to go in popover
    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger btn-sm";
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => {
      fetch(`http://localhost:3001/events/${info.event.id}`, {
        method: "DELETE",
      })
        .then(() => {
          console.log(`Event ${info.event.id} deleted`);
          handleEventsChanged();
        })
        .catch(console.error);
    };

    const popoverContent = document.createElement("div");
    popoverContent.appendChild(confirmationButton);
    popoverContent.appendChild(deleteButton);

    // create popover
    new bootstrap.Popover(info.el, {
      html: true,
      content: popoverContent,
      placement: "top",
      trigger: "focus",
    });

    info.el.focus();
  }

  return (
    <div className="d-flex flex-column flex-grow-1">
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
        eventColor="#6F6D6B"
        eventDrop={handleEventDrop}
        eventReceive={handleEventReceive}
        eventResize={handleEventResize}
        eventDragStop={handleEventDragStop}
        eventClick={handleEventClick}
        dragRevertDuration={0}
        validRange={currentProject ? { start: `${currentProject.start_month}-01` } : null}
      />
    </div>

  );

}