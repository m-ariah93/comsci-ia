import { useState } from "react";
import { Link } from "react-router-dom";
import { formatMonth } from "/src/utils/DateUtils";
import DeleteModal from "../../components/DeleteModal";
import { sortProjects } from "/src/utils/SortProjects";
import { useProjects } from "../../contexts/ProjectsContext";
import { filterProjects } from "/src/utils/FilterProjects";

export default function Archive() {

    const { archivedProjects, unarchiveProject } = useProjects();

    const [sortChoice, setSortChoice] = useState("Start, latest");

    const sortedProjects = sortProjects(archivedProjects, sortChoice);

    const [selectedProject, setSelectedProject] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const filteredProjects = filterProjects(sortedProjects, searchQuery);

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

    return (
        <div className="pe-3 pe-md-4">
            <div className="toast-container position-fixed bottom-0 end-0 p-3">
                <div id="projectArchivedToast" className="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true">
                    <div className="d-flex">
                        <div className="toast-body">
                            Project successfully moved to active projects.
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
            {archivedProjects.length === 0 ? (
                <div className="row gy-2">
                    <div className="col-12">
                        <div className="alert alert-primary text-center mx-auto" role="alert">
                            No projects found in archive. View active projects <Link to="/projects" className="alert-link text-reset">here</Link>.
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
                                        <h4 className="card-title" style={{ color: project.colour }}>{project.title}</h4>
                                        <p className="card-text">{project.address}</p>
                                        <p className="card-text">Start: {formatMonth(project.start_month)}</p>
                                        <button type="button" className="btn btn-secondary me-2" onClick={() => { unarchiveProject(project.id); showArchiveToast(); }}>Unarchive</button>
                                        <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteConfirmation" onClick={() => setSelectedProject(project.id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <DeleteModal projectId={selectedProject} inArchive={true} onDelete={showDeleteToast} />
                    </div>
                </>
            )}
        </div>
    );
}