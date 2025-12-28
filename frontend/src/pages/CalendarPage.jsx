import Calendar from "../components/Calendar";
import { useEffect, useRef, useState } from "react";
import { Draggable } from "@fullcalendar/interaction";
import plusIcon from "../assets/plus-lg.svg";
import { Link, useLocation } from "react-router-dom";
import { useProjects } from "../contexts/ProjectsContext";
import { formatDate, subtractDay } from "/src/utils/DateUtils";

export default function CalendarPage() {
    const draggableRef = useRef(null);
    const [nextEvent, setNextEvent] = useState(null);

    useEffect(() => {

        // event dragging
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

        // horizontal instead of vertical scrolling on navbar
        let horizontal = document.getElementById("navTabsHorizontal");
        horizontal.addEventListener('wheel', (e) => {
            e.preventDefault();
            horizontal.scrollLeft += e.deltaY * 0.2;
        });

    }, []); // runs once on page load

    // track which calendar is open 
    // all project view is 0
    const [currentProject, setCurrentProject] = useState(0);

    const { projects } = useProjects();

    useEffect(() => {
        // fetch next event
        fetch("http://localhost:3001/events/next")
            .then(res => res.json())
            .then(data => {
                console.log("events/next response:", data)
                setNextEvent(data)
            })
            .catch(() => setNextEvent(null));

    }, []); // figure out how to make this run every time an event changes

    const location = useLocation();

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
                <div className="col-9 d-flex flex-nowrap">
                    <ul className="nav nav-tabs overflow-x-auto overflow-y-hidden flex-nowrap text-nowrap" id="navTabsHorizontal">
                        <li className="nav-item">
                            <a className={`nav-link ${currentProject === 0 ? 'active' : ''}`} href="#" onClick={() => setCurrentProject(0)}>All</a>
                        </li>
                        {projects.map((project) => (
                            <li className="nav-item" key={project.id}>
                                <a className={`nav-link ${currentProject === project.id ? 'active' : ''}`} href="#" onClick={() => setCurrentProject(project.id)}>{project.title}</a>
                            </li>
                        ))}
                    </ul>
                    <Link to="/projects/add" state={{ from: location }} className="btn btn-outline-primary"><img src={plusIcon} /></Link>
                </div>
                <div className="col-3">
                    <input type="text" className="form-control" placeholder="search" />
                </div>
            </div>
            <div className="row h-100 overflow-hidden">
                <div className="col-9 d-flex flex-column h-100 pb-4">
                    <Calendar style={{ flex: 1 }} key={currentProject} currentProject={currentProject} />
                </div>
                <div className="col-3 mh-100" id="draggable-events">
                    {currentProject !== 0 ? (
                        <>
                            <h4>Key bookings</h4>
                            <div className="overflow-auto h-50">
                                {events.map((event) => (
                                    <div key={event} className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event fc-event-draggable my-1'>
                                        <div className='fc-event-main'>{event}</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        // next upcoming event
                        <>
                            <h4>Next up</h4>
                            <div className="h-50 pt-2">
                                {nextEvent ? (
                                    <div className="card p-2">
                                        <div className="card-body">
                                            <h5 className="fw-bold">{nextEvent.title}</h5>
                                            <div className="">{nextEvent.project_title || "No associated project"}</div>
                                        </div>
                                        <hr className="m-0" />
                                        <div className="card-body">
                                            <div className="">{nextEvent.end && "Start: "}{formatDate(nextEvent.start)}</div>
                                            {nextEvent.end && (
                                                <div className="small">End: {formatDate(subtractDay(nextEvent.end))}</div>
                                            )}
                                        </div>
                                        <hr className="m-0" />
                                        <div className="card-body">
                                            <a href="#" class="btn btn-secondary btn-sm me-2">Request confirmation</a>
                                            <a href="#" class="btn btn-danger btn-sm">Delete</a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-secondary">No upcoming events :(</div>
                                )}

                            </div>
                        </>
                    )}
                    <div className="d-grid gap-2 my-3">
                        <button className="btn btn-primary" type="button">New custom event</button>
                    </div>
                </div>
            </div>

        </div>
    );
}