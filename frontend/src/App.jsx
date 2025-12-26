import CalendarPage from "./pages/CalendarPage";
import ChecklistPage from "./pages/ChecklistPage";
import ProjectsPage from "./pages/ProjectsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import EditProject from "./pages/projects/EditProject";
import AddProject from "./pages/projects/AddProject";
import Archive from "./pages/projects/Archive";
import ProjectsList from "./pages/projects/ProjectsList";

import ProtectedRoute from "./components/ProtectedRoute";
import AuthLayout from "./pages/layouts/AuthLayout";
import AppLayout from "./pages/layouts/AppLayout";

import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/" element={<LoginPage />} />
            </Route>

            <Route element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/checklist" element={<ChecklistPage />} />
              <Route path="/projects" element={<ProjectsPage />}>
                <Route index element={<ProjectsList />} />
                <Route path="edit/:id" element={<EditProject />} />
                <Route path="add" element={<AddProject />} />
                <Route path="archive" element={<Archive />} />
              </Route>
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
    </BrowserRouter>
  );
}

export default App;
