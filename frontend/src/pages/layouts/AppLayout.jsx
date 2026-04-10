import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function AppLayout() {
    const { logout } = useAuth();

    return (
        <div className="d-flex align-items-start vh-100">
            <div className="h-100 me-3" style={{ backgroundColor: "#dbe5e8" }}>
                <div className="nav flex-column nav-pills mx-2 mx-sm-3 pt-3 gap-3 gap-sm-2" role="tablist" aria-orientation="vertical">
                    <NavLink to="/calendar" end className={({ isActive }) => isActive ? "nav-link text-center active" : "nav-link text-center"}>
                        <span className="d-none d-sm-inline">Calendar</span>
                        <i className="bi bi-calendar-event-fill d-inline d-sm-none fs-5"></i>
                    </NavLink>
                    <NavLink to="/checklist" className={({ isActive }) => isActive ? "nav-link text-center active" : "nav-link text-center"}>
                        <span className="d-none d-sm-inline">Checklist</span>
                        <i className="bi bi-clipboard2-check-fill d-inline d-sm-none fs-5"></i>
                    </NavLink>
                    <NavLink to="/projects" className={({ isActive }) => isActive ? "nav-link text-center active" : "nav-link text-center"}>
                        <span className="d-none d-sm-inline">Projects</span>
                        <i className="bi bi-grid-fill d-inline d-sm-none fs-5"></i>
                    </NavLink>
                    <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-link text-center active" : "nav-link text-center"}>
                        <span className="d-none d-sm-inline">Settings</span>
                        <i className="bi bi-gear-fill d-inline d-sm-none fs-5"></i>
                    </NavLink>
                    <hr />
                    <button className="nav-link text-center" onClick={logout}>
                        <span className="d-none d-sm-inline">Logout</span>
                        <i className="bi bi-box-arrow-right d-inline d-sm-none fs-5"></i>
                    </button>
                </div>
            </div>

            <div className="tab-content w-100 flex-grow-1 d-flex flex-column vh-100" id="v-pills-tabContent" style={{ minWidth: 0 }}>
                <Outlet />
            </div>
        </div>
    );
}
