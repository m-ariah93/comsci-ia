import { Outlet, NavLink, useParams } from "react-router-dom";

export default function ProjectsPage() {
    return (
        <>
            <div className="container-fluid d-flex flex-column vh-100 ps-0">
                <div className="row h-100 pt-3">
                    <div className="d-flex flex-column col-sm-4 col-md-3 col-lg-3 col-xl-2 gap-2 mb-3 mx-auto">
                        <NavLink to="/projects" end className={({ isActive }) => isActive ? "btn btn-primary text-start active" : "btn btn-primary text-start"} style={{ height: '40px' }}>Active projects</NavLink>
                        <NavLink to="/projects/add" end className={({ isActive }) => isActive ? "btn btn-primary text-start active" : "btn btn-primary text-start"} style={{ height: '40px' }}>Add new project</NavLink>
                        <NavLink to="/projects/archive" end className={({ isActive }) => isActive ? "btn btn-primary text-start active" : "btn btn-primary text-start"} style={{ height: '40px' }}>View archive</NavLink>
                    </div>
                    <main className="col-sm-8 col-md-9 col-lg-9 col-xl-10 overflow-auto pe-sm-4">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
}