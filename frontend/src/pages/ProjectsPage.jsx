import { Outlet, NavLink, useParams } from "react-router-dom";

export default function ProjectsPage() {
    return (
        <>
            <div className="container-fluid d-flex flex-column vh-100">
                <div className="row h-100">
                    <div className="d-flex flex-column col-2 gap-2 mx-auto">
                        <NavLink to="/projects" end className={({ isActive }) => isActive ? "btn btn-primary text-start active" : "btn btn-primary text-start"}>Active projects</NavLink>
                        <NavLink to="/projects/add" end className={({ isActive }) => isActive ? "btn btn-primary text-start active" : "btn btn-primary text-start"}>Add new project</NavLink>
                        <NavLink to="/projects/archive" end className={({ isActive }) => isActive ? "btn btn-primary active text-start" : "btn btn-primary text-start"}>View archive</NavLink>
                    </div>
                    <main className="col-10 overflow-auto pe-5 vh-100">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
}