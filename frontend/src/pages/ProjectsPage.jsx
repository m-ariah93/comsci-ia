import { Outlet, NavLink } from "react-router-dom";

export default function ProjectsPage() {
    return (
        <>
            <div className="container-fluid vh-100 px-0">
                <div className="d-flex flex-column flex-md-row h-100 pt-3">
                    <div className="d-flex flex-column gap-2 mb-4 w-100 flex-shrink-1 me-4" style={{ maxWidth: "190px" }}>
                        <NavLink to="/projects" end className={({ isActive }) => isActive ? "btn btn-primary text-start active" : "btn btn-primary text-start"} style={{ height: '40px' }}>Active projects</NavLink>
                        <NavLink to="/projects/add" end className={({ isActive }) => isActive ? "btn btn-primary text-start active" : "btn btn-primary text-start"} style={{ height: '40px' }}>Add new project</NavLink>
                        <NavLink to="/projects/archive" end className={({ isActive }) => isActive ? "btn btn-primary text-start active" : "btn btn-primary text-start"} style={{ height: '40px' }}>View archive</NavLink>
                    </div>
                    <main className="flex-grow-1 overflow-y-auto overflow-x-hidden h-100 px-0 pb-3">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
}