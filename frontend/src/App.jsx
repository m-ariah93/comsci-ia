import CalendarPage from "./pages/CalendarPage";
import ChecklistPage from "./pages/ChecklistPage";
import ProjectsPage from "./pages/ProjectsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import EditProject from "./pages/projects/EditProject";
import AddProject from "./pages/projects/AddProject";
import Archive from "./pages/projects/Archive";
import ProjectsList from "./pages/projects/ProjectsList";
import { BrowserRouter, Routes, Route, NavLink, Navigate, useParams } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>

      <div className="d-flex align-items-start">
          <div className="nav flex-column nav-pills me-3 mt-2" role="tablist" aria-orientation="vertical">
            <NavLink to="/calendar" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Calendar</NavLink>
            <NavLink to="/checklist" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Checklist</NavLink>
            <NavLink to="/projects" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Projects</NavLink>
            <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Settings</NavLink>
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Logout</NavLink>
          </div>

          <div className="tab-content w-100 vh-100" id="v-pills-tabContent" style={{minWidth: 0}}>
            <Routes>
              <Route path="/" element={<Navigate to="/calendar" replace />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/checklist" element={<ChecklistPage />} />
              <Route path="/projects" element={<ProjectsPage />}>
                <Route index element={<ProjectsList />} />
                <Route path="edit/:id" element={<EditProject />} />
                <Route path="add" element={<AddProject />} />
                <Route path="archive" element={<Archive />} />
              </Route>
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
