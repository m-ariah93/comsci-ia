export function archiveProject(id) {
    console.log("Attempting to archive project " + id)
    fetch(`http://localhost:3001/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            archived: 1,
        })
    });
}

export function unarchiveProject(id) {
    fetch(`http://localhost:3001/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            archived: 0,
        })
    });
}

// need update project details function