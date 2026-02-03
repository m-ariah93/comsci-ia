import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatMonth } from "/src/utils/DateUtils";
import DeleteModal from "../../components/DeleteModal";
import { useProjects } from "../../contexts/ProjectsContext";
import { sortProjects } from "/src/utils/SortProjects";
import { filterProjects } from "/src/utils/FilterProjects";

export default function ProjectsList() {

    const { activeProjects, archiveProject } = useProjects();

    const [sortChoice, setSortChoice] = useState("Start, latest");

    const sortedProjects = sortProjects(activeProjects, sortChoice);

    const [selectedProject, setSelectedProject] = useState(null);

    const location = useLocation();
    const showUpdatedToast = location.state?.updated;
    console.log("showToast:", showUpdatedToast);
    console.log("location.state:", location.state);

    useEffect(() => {
        if (showUpdatedToast) {
            const toast = document.getElementById("projectSavedToast");
            if (toast) {
                const bsToast = bootstrap.Toast.getOrCreateInstance(toast);
                bsToast.show();
            }
        }
    }, [showUpdatedToast]);

    function showArchiveToast() {
        const toast = document.getElementById("projectArchivedToast");
        if (toast) {
            const bsToast = bootstrap.Toast.getOrCreateInstance(toast);
            bsToast.show();
        }
    }

    function showDeleteToast() {
        const toast = document.getElementById("projectDeletedToast");
        if (toast) {
            const bsToast = bootstrap.Toast.getOrCreateInstance(toast);
            bsToast.show();
        }
    }

    const [searchQuery, setSearchQuery] = useState("");
    const filteredProjects = filterProjects(sortedProjects, searchQuery);

    return (
        <div className="pe-3 pe-md-4">
            <div className="toast-container position-fixed bottom-0 end-0 p-3">
                <div id="projectSavedToast" className="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true">
                    <div className="d-flex">
                        <div className="toast-body">
                            Project successfully updated.
                        </div>
                        <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>

            <div className="toast-container position-fixed bottom-0 end-0 p-3">
                <div id="projectArchivedToast" className="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true">
                    <div className="d-flex">
                        <div className="toast-body">
                            Project successfully archived.
                        </div>
                        <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>

            <div className="toast-container position-fixed bottom-0 end-0 p-3">
                <div id="projectDeletedToast" className="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true">
                    <div className="d-flex">
                        <div className="toast-body">
                            Project successfully deleted.
                        </div>
                        <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>

            {/* if no projects, show message */}
            {activeProjects.length === 0 ? (
                <div className="row gy-2">
                    <div className="col-12">
                        <div className="alert alert-primary text-center mx-auto" role="alert">
                            No projects found :( Create one <Link to="/projects/add" className="alert-link text-reset">here</Link>.
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="d-flex flex-wrap mb-4 column-gap-3 row-gap-2">
                        <div className="flex-grow-1" style={{ minWidth: 0 }}>
                            <input type="text" className="form-control" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <div style={{ width: "170px", maxWidth: "170px" }}>
                            <div className="dropdown">
                                <button className="btn btn-light border dropdown-toggle w-100 text-start" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Sort: {sortChoice}
                                </button>
                                <ul className="dropdown-menu">
                                    <li><button className="dropdown-item" onClick={() => setSortChoice("Start, latest")}>Start, latest</button></li>
                                    <li><button className="dropdown-item" onClick={() => setSortChoice("Start, earliest")}>Start, earliest</button></li>
                                    <li><button className="dropdown-item" onClick={() => setSortChoice("Name, A-Z")}>Name, A-Z</button></li>
                                    <li><button className="dropdown-item" onClick={() => setSortChoice("Name, Z-A")}>Name, Z-A</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {filteredProjects.length === 0 && (
                        <div className="alert alert-secondary text-center">
                            No projects match your search :(
                        </div>
                    )}
                    <div className="row g-3">
                        {filteredProjects.map((project) => (
                            <div key={project.id} className="col-sm-12 col-md-12 col-lg-6">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title" style={{ color: project.colour }} >{project.title}</h4>
                                        <p className="card-text">{project.address}</p>
                                        <p className="card-text">Start: {formatMonth(project.start_month)}</p>
                                        <Link to={`/projects/edit/${project.id}`} state={{ fromList: true }} className="btn btn-primary me-2">
                                            Edit
                                        </Link>
                                        <button type="button" className="btn btn-secondary me-2" onClick={() => { archiveProject(project.id); showArchiveToast(); }}>Archive</button>
                                        <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteConfirmation" onClick={() => setSelectedProject(project.id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <DeleteModal projectId={selectedProject} onDelete={showDeleteToast} onArchive={showArchiveToast} />
                    </div>
                </>
            )}
        </div>
    );
}