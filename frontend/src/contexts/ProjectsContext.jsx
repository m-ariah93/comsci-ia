import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
    archiveProject as dbArchive,
    unarchiveProject as dbUnarchive,
    deleteProject as dbDelete,
    saveProject as dbSave
} from "/src/utils/ProjectDbUtils";

const ProjectsContext = createContext();

export function ProjectsProvider({ children }) {
    const [activeProjects, setActiveProjects] = useState([]);
    const [archivedProjects, setArchivedProjects] = useState([]);
    const location = useLocation();

    const refreshProjects = () => {
        fetch("http://localhost:3001/projects?archived=0") // only active projects
            .then((res) => res.json())
            .then((data) => setActiveProjects(data))
            .catch(console.error);

        fetch("http://localhost:3001/projects?archived=1") // only archived projects
            .then((res) => res.json())
            .then((data) => setArchivedProjects(data))
            .catch(console.error);
    }

    useEffect(() => {
        refreshProjects();
    }, [location]);

    const archiveProject = (id) =>
        dbArchive(id).then(refreshProjects);

    const unarchiveProject = (id) =>
        dbUnarchive(id).then(refreshProjects);

    const deleteProject = (id) =>
        dbDelete(id).then(refreshProjects);

    const saveProject = (...args) =>
        dbSave(...args).then(refreshProjects);


    return (
        <ProjectsContext.Provider value={{ activeProjects, archivedProjects, archiveProject, unarchiveProject, deleteProject, saveProject }}>
            {children}
        </ProjectsContext.Provider>
    );
}

export function useProjects() {
    return useContext(ProjectsContext);
}
