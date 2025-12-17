import { Outlet, NavLink, useParams } from "react-router-dom";

export default function ProjectsPage() {
    return (
        <div>
            <div className="container-fluid d-flex flex-column vh-100">
                <div className="row">
                    <div className="d-flex flex-column col-2 mx-auto">
                        <NavLink to="/projects" end className={({ isActive }) => isActive ? "btn btn-primary text-start active" : "btn btn-primary text-start"}>All projects</NavLink>
                        <NavLink to="/projects/add" end className={({ isActive }) => isActive ? "btn btn-primary text-start active" : "btn btn-primary text-start"}>Add new project</NavLink>
                        <NavLink to="/projects/archive" end className={({ isActive }) => isActive ? "btn btn-primary active text-start" : "btn btn-primary text-start"}>View archive</NavLink>
                    </div>
                    <main className="col-10 overflow-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}