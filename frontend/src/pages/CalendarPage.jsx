import Calendar from "../components/Calendar";
import { useEffect, useRef } from "react";
import { Draggable } from "@fullcalendar/interaction";

export default function CalendarPage() {
    const draggableRef = useRef(null);
    useEffect(() => {
        const containerEl = document.getElementById("draggable-events");
        if (containerEl && !draggableRef.current) {
            // store the Draggable instance in the ref
            draggableRef.current = new Draggable(containerEl, {
                itemSelector: ".fc-event",
                eventData: function (eventEl) {
                    return {
                        title: eventEl.innerText,
                    };
                },
            });
        }
    }, []);
    return (
        <div className="container-fluid d-flex flex-column vh-100">
            <div className="row my-2">
                <div className="col-9">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">All</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">House 1</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">House 2</a>
                        </li>
                    </ul>
                </div>
                <div className="col-3">
                    <input type="text" className="form-control" placeholder="search" />
                </div>
            </div>
            {/* <div className="row h-100"> */}
            <div className="row h-100">

                <div className="col-9">
                    <Calendar />
                </div>

                <div className="col-3" id="draggable-events">
                    <h4>Key bookings</h4>
                    <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event fc-event-draggable'>
                        <div className='fc-event-main'>Plumber</div>
                    </div>
                    <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event fc-event-draggable'>
                        <div className='fc-event-main'>Bricklayer</div>
                    </div>
                    <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event fc-event-draggable'>
                        <div className='fc-event-main'>Painter</div>
                    </div>
                </div>
            </div>

        </div>
    );
}