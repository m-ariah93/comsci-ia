import Calendar from "../components/Calendar";
import { useEffect, useRef, useState } from "react";
import { Draggable } from "@fullcalendar/interaction";
import plusIcon from "../assets/plus-lg.svg";
import { Link } from "react-router-dom";
import { useProjects } from "../contexts/ProjectsContext";

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

    // track which calendar is open 
    // all project view is 0
    const [currentProject, setCurrentProject] = useState(0);

    const { projects } = useProjects();

    const events = [
        "Excavator",
        "Retaining walls",
        "Site set out",
        "Plumber drainer",
        "Plumber rough in",
        "Plumber fit off",
        "Bobcat",
        "Pier inspection",
        "Concreter",
        "Termite protection",
        "Slab inspection",
        "Concrete pump",
        "Electrician U/Power",
        "Electrician rough in",
        "Electrician fit off",
        "Electrician AC",
        "Crane truss lift",
        "Frame inspection",
        "Edge protection",
        "Carpenter frame",
        "Carpenter rough in",
        "Carpenter soffits",
        "Carpenter fix out",
        "Carpenter finish out",
        "Bricklayer",
        "Garage door",
        "Tiler",
        "Painter",
        "Concrete kerb cut",
        "Drive/concreter",
        "Dividing fencing",
        "Fencing",
        "Bobcat clean",
        "TV antenna",
        "Garden kerbing",
        "Insulation/ceiling",
        "Final inspection",
        "Cleaning",
        "Silicon sealer"
    ];

    return (
        <div className="container-fluid d-flex flex-column vh-100">
            <div className="row my-2">
                <div className="col-9">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <a className={`nav-link ${currentProject === 0 ? 'active' : ''}`} href="#" onClick={() => setCurrentProject(0)}>All</a>
                        </li>
                        {/* <li className="nav-item">
                            <a className={`nav-link ${currentProject === 1 ? 'active' : ''}`} href="#" onClick={() => setCurrentProject(1)}>House 1</a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${currentProject === 2 ? 'active' : ''}`} href="#" onClick={() => setCurrentProject(2)}>House 2</a>
                        </li> */}
                        {projects.map((project) => (
                            <li className="nav-item">
                                <a className={`nav-link ${currentProject === project.id ? 'active' : ''}`} href="#" onClick={() => setCurrentProject(project.id)}>{project.title}</a>
                            </li>
                        ))}
                        <Link to="/projects/add" className="btn btn-outline-primary ms-auto"><img src={plusIcon} /></Link>
                        {/* todo: make it redirect back to calendar after adding (instead of projects list) */}
                    </ul>
                </div>
                <div className="col-3">
                    <input type="text" className="form-control" placeholder="search" />
                </div>
            </div>
            <div className="row h-100 overflow-hidden">
                <div className="col-9 d-flex flex-column h-100 pb-4">
                    <Calendar style={{ flex: 1 }} key={currentProject} currentProject={currentProject}/>
                </div>

                <div className="col-3 mh-100" id="draggable-events">
                    <h4>Key bookings</h4>
                    <div className="overflow-auto h-50">
                        {events.map((event) => (
                            <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event fc-event-draggable my-1'>
                                <div key={event.id} className='fc-event-main'>{event}</div>
                            </div>
                        ))}
                    </div>
                    <div className="d-grid gap-2 my-3">
                        <button className="btn btn-primary" type="button">New custom event</button>
                    </div>
                </div>
            </div>

        </div>
    );
}