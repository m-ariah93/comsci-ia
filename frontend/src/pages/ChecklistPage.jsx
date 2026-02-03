import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useProjects } from "../contexts/ProjectsContext";

export default function ChecklistPage() {

    const { activeProjects } = useProjects();
    const [currentProjectId, setCurrentProjectId] = useState(
        activeProjects.length > 0 ? activeProjects[0].id : null
    );

    const [checklist, setChecklist] = useState([]);

    useEffect(() => {
        if (activeProjects.length > 0) {
            // horizontal instead of vertical scrolling on navbar
            let horizontal = document.getElementById("navTabsHorizontal");
            horizontal.addEventListener('wheel', (e) => {
                e.preventDefault();
                horizontal.scrollLeft += e.deltaY * 0.2;
            });
        }
    }, []);

    useEffect(() => {
        if (!currentProjectId) return;
        fetch(`http://localhost:3001/projects/${currentProjectId}/checklist`)
            .then(res => res.json())
            .then(data => setChecklist(data));
    }, [currentProjectId, onChecklistChange]);

    const location = useLocation();

    function onChecklistChange(checklistId, checked) {
        fetch(`http://localhost:3001/projects/${currentProjectId}/checklist/${checklistId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                done: checked ? 1 : 0,
            })
        });
    }

    return (
        <>
            {/* if no projects, show message */}
            {activeProjects.length === 0 ? (
                <div className="row gy-2 pt-3">
                    <div className="col-12">
                        <div className="alert alert-primary text-center mx-auto" role="alert">
                            No projects found :( Create one <Link to="/projects/add" className="alert-link text-reset">here</Link>.
                        </div>
                    </div>
                </div>
            ) : (
                <div className="container-fluid d-flex flex-column vh-100 ps-0 pe-0" style={{ minHeight: 0 }}>
                    <div className="d-flex flex-nowrap mt-3 mb-2">
                        <ul className="nav nav-tabs overflow-x-auto overflow-y-hidden flex-nowrap text-nowrap w-100" id="navTabsHorizontal">
                            {activeProjects.map((project) => (
                                <li className="nav-item" key={project.id}>
                                    <a className={`nav-link ${currentProjectId === project.id ? 'active fw-semibold' : ''}`} href="#" style={{ color: project.colour }} onClick={() => setCurrentProjectId(project.id)}>{project.title}</a>
                                </li>
                            ))}
                            <Link to="/projects/add" state={{ from: location }} className="btn btn-outline-secondary ms-2 d-flex align-items-center justify-content-center p-0 mt-1" style={{ width: "30px", height: "30px" }}><i className="bi bi-plus fs-4"></i></Link>
                        </ul>
                    </div>
                    <h4 className="py-2">Order checklist</h4>
                    <ul className="list-group overflow-auto flex-grow-1 pb-3 me-4" style={{ minHeight: 0 }}>
                        {checklist.map((item, i) => (
                            <li key={`check-${i}`} className='list-group-item position-relative'>
                                <input className="form-check-input me-2" type="checkbox" value="" id={`check-${i}`} onChange={(e) => onChecklistChange(item.id, e.target.checked)} checked={Boolean(item.done)} />
                                <label className={`form-check-label ${item.done && "text-decoration-line-through"}`} htmlFor={`check-${i}`}>{item.title}</label>
                                <label
                                    htmlFor={`check-${i}`}
                                    className="stretched-link"
                                    style={{ cursor: "pointer" }}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}