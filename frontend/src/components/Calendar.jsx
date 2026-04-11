import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { useRef, useEffect } from "react";


export default function Calendar({ currentProjectId, currentProject, keyBookingsRef, events, onEventsChanged, mailtoLink }) {

  useEffect(() => {
    handleEventsChanged();
  }, [currentProjectId]);

  function handleEventDrop(info) {
    fetch(`/api/events/${info.event.id}`, {
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
    fetch("/api/events", {
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
    fetch(`/api/events/${info.event.id}`, {
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
    const templateId = info.event.extendedProps.template_id;
    if (isOverElement(info.jsEvent, keyBookingsRef) && templateId) {
      const eventId = info.event.id;

      info.event.remove();

      fetch(`/api/events/${eventId}`, {
        method: "DELETE", // delete from events table
      })
        .then(() => {
          info.event.remove();
          handleEventsChanged();
        })
        .then(console.log(`event removed, title: ${info.event.title}, id: ${currentProjectId}`))
        .catch(console.error);
    }
  }

  function saveEventNote(eventId, noteValue) {
    fetch(`/api/events/${eventId}/note`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: noteValue })
    })
      .catch(console.error);
  }

  const popoverRef = useRef(null);
  function handleEventClick(info) {
    if (popoverRef.current) {
      popoverRef.current.dispose();
      popoverRef.current = null;
    }

    // event title label
    const eventLabel = document.createElement("h6");
    eventLabel.className = "mb-2";
    eventLabel.textContent = info.event.title;

    // note input field
    const noteInput = document.createElement("input");
    noteInput.type = "text";
    noteInput.className = "form-control form-control-sm mb-2";
    noteInput.placeholder = "Loading...";
    noteInput.maxLength = "30";
    noteInput.disabled = true;

    // buttons to go in popover
    const confirmationButton = document.createElement("a");
    confirmationButton.className = "btn btn-secondary btn-sm me-2 disabled";
    confirmationButton.textContent = "Request confirmation";

    fetch(`/api/events/${info.event.id}`)
      .then(res => res.json())
      .then(data => {
        noteInput.value = data.note || "";
        noteInput.placeholder = "Add note..."
        noteInput.disabled = false;
        confirmationButton.href = mailtoLink(data);
        confirmationButton.classList.remove("disabled");
      });

    // note input event handlers
    noteInput.addEventListener("blur", (e) => {
      const trimmed = e.target.value.trim();
      saveEventNote(info.event.id, trimmed);
    });

    noteInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const trimmed = e.target.value.trim();
        saveEventNote(info.event.id, trimmed);
        e.target.blur();
      }
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger btn-sm";
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => {
      // close and reset popover
      popoverRef.current?.dispose();
      popoverRef.current = null;

      // delete event from db
      fetch(`/api/events/${info.event.id}`, {
        method: "DELETE",
      })
        .then(() => {
          console.log(`Event ${info.event.id} deleted`);
          handleEventsChanged();
        })
        .catch(console.error);
    };

    const popoverContent = document.createElement("div");
    popoverContent.appendChild(eventLabel);
    popoverContent.appendChild(noteInput);
    popoverContent.appendChild(confirmationButton);
    popoverContent.appendChild(deleteButton);

    // create popover
    const popover = new bootstrap.Popover(info.el, {
      html: true,
      content: popoverContent,
      placement: "top",
      trigger: "manual",
    });

    popover.show();
    popoverRef.current = popover;
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (!popoverRef.current) return;

      const popoverEl = document.querySelector(".popover");
      if (popoverEl && !popoverEl.contains(e.target) && !e.target.closest(".fc-event")) {
        popoverRef.current.dispose();
        popoverRef.current = null;
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  function renderEventContent(eventInfo) {
    return (
      <div className="d-flex">
        <span className="fc-event-title my-0">{eventInfo.event.title}</span>
        {eventInfo.event.extendedProps.note && (
          <i className="bi bi-three-dots ms-auto me-1"></i>
        )
        }
      </div>
    )

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
        eventContent={renderEventContent}
        dragRevertDuration={0}
        validRange={currentProject ? { start: `${currentProject.start_month}-01` } : null}
      />
    </div>

  );

}