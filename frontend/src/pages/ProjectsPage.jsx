import { Outlet, NavLink } from "react-router-dom";

export default function ProjectsPage() {
    return (
        <>
            <div className="container-fluid vh-100 px-0">
                <div className="d-flex flex-column flex-md-row h-100 pt-3">
                    <div className="d-flex flex-column nav-pills gap-2 mb-3 w-100 pe-3 me-2" role="tablist" aria-orientation="vertical" style={{ maxWidth: "180px" }}>
                        <NavLink to="/projects" end className={({ isActive }) => isActive ? "nav-link active py-2 px-3" : "nav-link py-2 px-3"}>Active projects</NavLink>
                        <NavLink to="/projects/add" end className={({ isActive }) => isActive ? "nav-link active py-2 px-3" : "nav-link py-2 px-3"}>Add new project</NavLink>
                        <NavLink to="/projects/archive" end className={({ isActive }) => isActive ? "nav-link active py-2 px-3" : "nav-link py-2 px-3"}>View archive</NavLink>
                    </div>
                    <main className="flex-grow-1 overflow-y-auto overflow-x-hidden h-100 px-0 pb-3">
                        <div className="pe-3 pe-md-4">
                            <hr className="w-100 mt-0 d-block d-md-none" />
                        </div>
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
}