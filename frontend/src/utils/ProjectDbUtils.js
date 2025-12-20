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

export function saveProject(id, title, address, startMonth) {
    // need to add form validation: character limit on title
    fetch(`http://localhost:3001/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title,
            address,
            startMonth,
        })
    })
        .then((res) => res.json())
        .catch(console.error);
}

export function deleteProject(id) {
    // needs writing
}