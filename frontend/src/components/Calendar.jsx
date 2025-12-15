import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function Calendar() {
  return (
    <div style={{width: '100%'}}>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        // aspectRatio={1.5}
        firstDay={1}
        droppable={true}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay'
        }}
      />
    </div>
    
  );
  
}