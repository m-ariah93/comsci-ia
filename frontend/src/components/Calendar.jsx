import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction';


export default function Calendar() {
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
          right: 'dayGridMonth,dayGridWeek'
        }}
      />
    </div>

  );

}