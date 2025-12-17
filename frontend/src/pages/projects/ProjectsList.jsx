import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

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

    return (
        <div className="row">
            {projects.map((project) => (
                <div key={project.id} className="col-sm-6 mb-3">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">{project.title}</h4>
                            <p className="card-text">{project.address}</p>
                            <Link to={`/projects/edit/${project.id}`} state={{ fromList: true }} className="btn btn-primary">
                                Edit
                            </Link>
                            <button type="button" className="btn btn-secondary">Archive</button>
                            <button type="button" className="btn btn-danger">Delete</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}