import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useProjects } from "../contexts/ProjectsContext";
import plusIcon from "../assets/plus-lg.svg";

export default function ChecklistPage() {

    const checklist = [
        "Retaining walls order",
        "Crusher dust",
        "Concrete",
        "Steel/reo",
        "Pods",
        "WC hire",
        "Bolts tie down",
        "Gas fitter rough in",
        "Gas fitter fit off",
        "Phone rough in",
        "Hardware: rough in",
        "Hardware: fit off",
        "Hardware: FC",
        "Hardware: sink",
        "Hardware: PC",
        "Hardware: steel lintels",
        "Bricks",
        "Lights",
        "Water tank and pump",
        "Tile order",
        "Turf",
        "Landscaping",
        "Disconnect power",
        "Gas connection",
        "Oven",
        "Cooktop",
        "White goods",
        "Book gas fitter",
        "Hand over folder",
        "NBN connection",
        "Covenant bond refund"
    ];

    const { activeProjects } = useProjects();
    const [currentProject, setCurrentProject] = useState(
        activeProjects.length > 0 ? activeProjects[0].id : null
    );

    const location = useLocation();

    return (
        <>
            {/* if no projects, show message */}
            {activeProjects.length === 0 ? (
                <div className="alert alert-primary text-center mx-auto" role="alert">
                    No projects found :( Create one <Link to="/projects/add" className="alert-link text-reset">here</Link>.
                </div>
            ) : (
                <div className="container-fluid d-flex flex-column vh-100 pe-4" style={{ minHeight: 0 }}>
                    <div className="d-flex flex-nowrap my-2">
                        <ul className="nav nav-tabs overflow-x-auto overflow-y-hidden flex-nowrap text-nowrap w-100" id="navTabsHorizontal">
                            {activeProjects.map((project) => (
                                <li className="nav-item" key={project.id}>
                                    <a className={`nav-link ${currentProject === project.id ? 'active fw-semibold' : ''}`} href="#" style={{ color: project.colour }} onClick={() => setCurrentProject(project.id)}>{project.title}</a>
                                </li>
                            ))}
                        </ul>
                        <Link to="/projects/add" state={{ from: location }} className="btn btn-outline-primary ms-auto"><img src={plusIcon} /></Link>
                    </div>
                    <h4>Order checklist</h4>
                    <ul className="list-group overflow-auto flex-grow-1 pb-4" style={{ minHeight: 0 }}>
                        {checklist.map((item, i) => (
                            <li key={`check-${i}`} className='list-group-item position-relative'>
                                <input className="form-check-input me-2" type="checkbox" value="" id={`check-${i}`} />
                                <label className="form-check-label" htmlFor={`check-${i}`}>{item}</label>
                                <label
                                    htmlFor={`check-${i}`}
                                    className="stretched-link"
                                    style={{ cursor: "pointer" }}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )};
        </>
    );
}