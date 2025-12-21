import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatMonth } from "/src/utils/DateUtils";
import { archiveProject } from "/src/utils/ProjectDbUtils";
import DeleteModal from "../../components/DeleteModal";

export default function ProjectsList() {
    // const projects = [
    //     { id: 1, title: "House 1", address: "1 abc street" },
    //     { id: 2, title: "House 2", address: "2 abc street" },
    //     { id: 3, title: "House 3", address: "3 abc street" }
    // ];

    const [projects, setProjects] = useState([]);
    useEffect(() => {
        fetch("http://localhost:3001/projects")
            .then((res) => res.json())
            .then((data) => setProjects(data))
            .catch(console.error);
    }, []);

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

    return (
        <div>
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
            {projects.length === 0 ? (
                <div className="alert alert-primary text-center mx-auto" role="alert">
                    No projects found :( Create one <Link to="/projects/add" className="alert-link">here</Link>.
                </div>
            ) : (
                <div className="row">
                    {projects.map((project) => (
                        <div key={project.id} className="col-sm-6 mb-3">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">{project.title}</h4>
                                    <p className="card-text">{project.address}</p>
                                    <p className="card-text">Started: {formatMonth(project.startMonth)}</p>
                                    <Link to={`/projects/edit/${project.id}`} state={{ fromList: true }} className="btn btn-primary">
                                        Edit
                                    </Link>
                                    <button type="button" className="btn btn-secondary" onClick={() => archiveProject(project.id)}>Archive</button>
                                    <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteConfirmation" onClick={() => setSelectedProject(project.id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <DeleteModal projectId={selectedProject}/>
                </div>
            )}
        </div>
    );
}