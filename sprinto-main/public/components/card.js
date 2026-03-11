export function issueCardHtml(issue, { assigneeName, draggable = true } = {}) {
  const assignee = assigneeName || "Unassigned";
  const dragAttr = draggable ? `draggable="true"` : "";
  return `
    <div class="issue" ${dragAttr} data-issue="${issue.id}" data-status="${issue.status}">
      <div class="issue__title">${escapeHtml(issue.title)}</div>
      <div class="issue__meta">
        <span class="badge">${escapeHtml(statusLabel(issue.status))}</span>
        <span class="badge">${escapeHtml(assignee)}</span>
      </div>
    </div>
  `;
}

export function statusLabel(status) {
  if (status === "in_progress") return "In Progress";
  return String(status).charAt(0).toUpperCase() + String(status).slice(1);
}

export function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

