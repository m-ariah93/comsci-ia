export function archiveProject(id) {
    console.log("Attempting to archive project " + id)
    return fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            archived: 1,
        })
    });
}

export function unarchiveProject(id) {
    return fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            archived: 0,
        })
    });
}

export function saveProject(id, title, address, startMonth, colour) {
    return fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title,
            address,
            start_month: startMonth,
            colour,
        })
    })
        .then((res) => res.json())
        .catch(console.error);
}

export function deleteProject(id) {
    console.log("Attempting to delete project " + id)
    return fetch(`/api/projects/${id}`, {
        method: "DELETE",
    })
    .catch(err => console.error("DELETE error:", err));
}