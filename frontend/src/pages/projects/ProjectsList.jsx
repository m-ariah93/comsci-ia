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
    const showToast = location.state?.updated;
    console.log("showToast:", showToast);
    console.log("location.state:", location.state);

    useEffect(() => {
        if (showToast) {
            const toast = document.getElementById("projectSavedToast");
            if (toast) {
                const bsToast = bootstrap.Toast.getOrCreateInstance(toast);
                bsToast.show();
            }
        }
    }, [showToast]);

    const [searchQuery, setSearchQuery] = useState("");
    const filteredProjects = filterProjects(sortedProjects, searchQuery);

    return (
        <>
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

            {/* if no projects, show message */}
            {activeProjects.length === 0 ? (
                <div className="row mt-2 gy-2">
                    <div className="col-12">
                        <div className="alert alert-primary text-center mx-auto" role="alert">
                            No projects found :( Create one <Link to="/projects/add" className="alert-link text-reset">here</Link>.
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="row mt-2 mb-3 gy-2">
                        <div className="col-sm-12 col-md-8 col-lg-9 col-xxl-10">
                            <input type="text" className="form-control" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <div className="col-sm-7 col-md-4 col-lg-3 col-xxl-2">
                            <div className="dropdown">
                                <button className="btn btn-light dropdown-toggle w-100 text-start" type="button" data-bs-toggle="dropdown" aria-expanded="false">
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
                    <div className="row">
                        {filteredProjects.map((project) => (
                            <div key={project.id} className="col-sm-12 col-md-12 col-lg-6 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title" style={{ color: project.colour }} >{project.title}</h4>
                                        <p className="card-text">{project.address}</p>
                                        <p className="card-text">Started: {formatMonth(project.start_month)}</p>
                                        <Link to={`/projects/edit/${project.id}`} state={{ fromList: true }} className="btn btn-primary me-2">
                                            Edit
                                        </Link>
                                        <button type="button" className="btn btn-secondary me-2" onClick={() => archiveProject(project.id)}>Archive</button>
                                        <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteConfirmation" onClick={() => setSelectedProject(project.id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <DeleteModal projectId={selectedProject} />
                    </div>
                </>
            )}
        </>
    );
}