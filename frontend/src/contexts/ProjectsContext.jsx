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

    // initialise project state variables
    const [activeProjects, setActiveProjects] = useState([]);
    const [archivedProjects, setArchivedProjects] = useState([]);

    function refreshProjects() {
        fetch("/api/projects?archived=0") // get only active projects
            .then((res) => res.json()) // parse json input into JS object
            .then((data) => setActiveProjects(data)) // update state
            .catch(console.error);

        fetch("/api/projects?archived=1") // get only archived projects
            .then((res) => res.json()) // parse json input into JS object
            .then((data) => setArchivedProjects(data)) // update state
            .catch(console.error);
    }

    const location = useLocation(); // React Router hook, returns location object
    useEffect(() => {
        refreshProjects();
    }, [location]); // re-runs whenever page changes

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
