import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatMonth } from "/src/utils/DateUtils";
import { unarchiveProject } from "/src/utils/ProjectDbUtils";
import DeleteModal from "../../components/DeleteModal";

export default function Archive() {

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3001/projects?archived=1") // only archived projects
            .then((res) => res.json())
            .then((data) => setProjects(data))
            .catch(console.error);
    }, []);

    const [sortChoice, setSortChoice] = useState("Start, latest");

    const [selectedProject, setSelectedProject] = useState(null);

    return (
        <div>
            {/* if no projects, show message */}
            {projects.length === 0 ? (
                <div className="alert alert-primary text-center mx-auto" role="alert">
                    No projects found in archive. View active projects <Link to="/projects" className="alert-link">here</Link>.
                </div>
            ) : (
                <div>
                    <div className="row mt-2 mb-3">
                        <div className="col-10">
                            <input type="text" className="form-control" placeholder="Search" />
                        </div>
                        <div className="col-2">
                            <div className="dropdown">
                                <button className="btn btn-light dropdown-toggle w-100 text-start" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Sort: {sortChoice}
                                </button>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#" onClick={(e) => setSortChoice("Start, latest")}>Start, latest</a></li>
                                    <li><a className="dropdown-item" href="#" onClick={(e) => setSortChoice("Start, earliest")}>Start, earliest</a></li>
                                    <li><a className="dropdown-item" href="#" onClick={(e) => setSortChoice("Name, A-Z")}>Name, A-Z</a></li>
                                    <li><a className="dropdown-item" href="#" onClick={(e) => setSortChoice("Name, Z-A")}>Name, Z-A</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {projects.map((project) => (
                            <div key={project.id} className="col-sm-6 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">{project.title}</h4>
                                        <p className="card-text">{project.address}</p>
                                        <p className="card-text">Started: {formatMonth(project.startMonth)}</p>
                                        <button type="button" className="btn btn-secondary" onClick={() => unarchiveProject(project.id)}>Unarchive</button>
                                        <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteConfirmation" onClick={() => setSelectedProject(project.id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <DeleteModal projectId={selectedProject} inArchive={true} />
                    </div>
                </div>
            )}
        </div>
    );
}