import { api, escapeHtml, html, openModal, closeModal, toast } from "./shared.js";
import { issueCardHtml } from "../components/card.js";

function findMemberName(team, id) {
  const m = (team?.members || []).find((x) => x.id === id);
  return m ? m.name : "Unassigned";
}

export async function loadBoardIssues(activeSprint) {
  if (!activeSprint) return [];
  const data = await api(`/api/issues?sprintId=${encodeURIComponent(activeSprint.id)}`);
  return data.issues || [];
}

export function boardView({ activeSprint, issues, team }) {
  if (!activeSprint) {
    return `
      <div class="card">
        <h3 class="card__title">No active sprint</h3>
        <div class="muted">Start a sprint to use the board.</div>
        <div style="height:10px"></div>
        <a class="btn btn--primary" href="#/sprints">Go to Sprint Management</a>
      </div>
    `;
  }

  const cols = [
    { key: "todo", title: "Todo" },
    { key: "in_progress", title: "In Progress" },
    { key: "done", title: "Done" },
  ];
  const grouped = Object.fromEntries(cols.map((c) => [c.key, []]));
  for (const i of issues || []) grouped[i.status]?.push(i);

  return html`
    <div class="row">
      <div class="muted">Active sprint</div>
      <div class="chip">${escapeHtml(activeSprint.name)}</div>
      <div class="spacer"></div>
      <button class="btn btn--primary" id="newIssueBtn">New issue</button>
    </div>
    <div style="height:12px"></div>
    <div class="kanban">
      ${cols
        .map((c) => {
          const list = grouped[c.key] || [];
          return html`
            <div class="col" data-col="${c.key}">
              <div class="col__title">${c.title} <span class="count">${list.length}</span></div>
              <div class="col__list" data-list="${c.key}">
                ${list.map((i) => issueCardHtml(i, { assigneeName: i.assigneeId ? findMemberName(team, i.assigneeId) : "Unassigned" })).join("")}
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

export function bindBoardHandlers({ activeSprint, team, onRefresh, getIssues }) {
  const newBtn = document.getElementById("newIssueBtn");
  if (newBtn) {
    newBtn.addEventListener("click", () => openCreateIssueModal({ activeSprint, team, onRefresh }));
  }

  // Click to edit
  document.querySelectorAll(".issue").forEach((card) => {
    card.addEventListener("click", () => openIssueEditor(card.getAttribute("data-issue"), { team, onRefresh, getIssues }));
  });

  // Drag & drop (optimistic UI + drop animation)
  document.querySelectorAll(".issue").forEach((card) => {
    card.addEventListener("dragstart", (e) => {
      card.classList.add("is-dragging");
      e.dataTransfer.setData("text/plain", card.getAttribute("data-issue"));
      e.dataTransfer.effectAllowed = "move";
    });
    card.addEventListener("dragend", () => card.classList.remove("is-dragging"));
  });

  document.querySelectorAll(".col").forEach((col) => {
    col.addEventListener("dragover", (e) => {
      e.preventDefault();
      col.classList.add("is-over");
    });
    col.addEventListener("dragleave", () => col.classList.remove("is-over"));
    col.addEventListener("drop", async (e) => {
      e.preventDefault();
      col.classList.remove("is-over");

      const issueId = e.dataTransfer.getData("text/plain");
      const newStatus = col.getAttribute("data-col");

      const card = document.querySelector(`.issue[data-issue="${CSS.escape(issueId)}"]`);
      const prevParent = card?.parentElement || null;

      // Optimistic UI move
      if (card) {
        const list = col.querySelector(".col__list");
        list.prepend(card);
        card.classList.add("is-dropped");
        setTimeout(() => card.classList.remove("is-dropped"), 260);
      }

      try {
        await api(`/api/issues/${issueId}/move`, { method: "POST", body: { status: newStatus } });
        await onRefresh();
      } catch (err) {
        // Revert UI if backend fails
        if (card && prevParent) prevParent.prepend(card);
        toast(err.message);
      }
    });
  });
}

function openCreateIssueModal({ activeSprint, team, onRefresh }) {
  openModal({
    title: "Create issue",
    bodyHtml: html`
      <div class="grid">
        <div class="field">
          <div class="label">Title</div>
          <input class="input" id="niTitle" placeholder="Implement drag-and-drop" />
        </div>
        <div class="field">
          <div class="label">Description</div>
          <textarea class="textarea" id="niDesc" placeholder="Acceptance criteria..."></textarea>
        </div>
        <div class="field">
          <div class="label">Assignee</div>
          <select class="select" id="niAssignee">
            <option value="">Unassigned</option>
            ${(team?.members || []).map((m) => `<option value="${m.id}">${escapeHtml(m.name)} (${escapeHtml(m.role)})</option>`).join("")}
          </select>
        </div>
      </div>
    `,
    footerHtml: `<button class="btn" data-close>Cancel</button><button class="btn btn--primary" id="createIssueConfirm">Create</button>`,
  });

  document.getElementById("createIssueConfirm").addEventListener("click", async () => {
    try {
      const title = document.getElementById("niTitle").value.trim();
      const description = document.getElementById("niDesc").value.trim();
      const assigneeId = document.getElementById("niAssignee").value || null;
      if (!title) return toast("Title is required.");

      const created = await api("/api/issues", { method: "POST", body: { title, description, sprintId: activeSprint.id, status: "todo" } });
      if (assigneeId) await api(`/api/issues/${created.issue.id}`, { method: "PATCH", body: { assigneeId } });
      closeModal();
      toast("Issue created.");
      await onRefresh();
    } catch (e) {
      toast(e.message);
    }
  });
}

async function openIssueEditor(issueId, { team, onRefresh, getIssues }) {
  try {
    const issues = await getIssues();
    const issue = issues.find((i) => i.id === issueId);
    if (!issue) return toast("Issue not found.");

    const memberOptions = [
      `<option value="">Unassigned</option>`,
      ...(team?.members || []).map((m) => `<option value="${m.id}">${escapeHtml(m.name)} (${escapeHtml(m.role)})</option>`),
    ].join("");

    openModal({
      title: "Edit issue",
      bodyHtml: html`
        <div class="grid">
          <div class="field">
            <div class="label">Title</div>
            <input class="input" id="eiTitle" value="${escapeHtml(issue.title)}" />
          </div>
          <div class="field">
            <div class="label">Description</div>
            <textarea class="textarea" id="eiDesc">${escapeHtml(issue.description || "")}</textarea>
          </div>
          <div class="grid grid--2">
            <div class="field">
              <div class="label">Status</div>
              <select class="select" id="eiStatus">
                <option value="todo" ${issue.status === "todo" ? "selected" : ""}>Todo</option>
                <option value="in_progress" ${issue.status === "in_progress" ? "selected" : ""}>In Progress</option>
                <option value="done" ${issue.status === "done" ? "selected" : ""}>Done</option>
              </select>
            </div>
            <div class="field">
              <div class="label">Assignee</div>
              <select class="select" id="eiAssignee">${memberOptions}</select>
            </div>
          </div>
        </div>
      `,
      footerHtml: `<button class="btn" data-close>Close</button><button class="btn btn--primary" id="saveIssueBtn">Save</button>`,
    });

    document.getElementById("eiAssignee").value = issue.assigneeId || "";

    document.getElementById("saveIssueBtn").addEventListener("click", async () => {
      try {
        const title = document.getElementById("eiTitle").value.trim();
        const description = document.getElementById("eiDesc").value.trim();
        const status = document.getElementById("eiStatus").value;
        const assigneeId = document.getElementById("eiAssignee").value || null;
        if (!title) return toast("Title is required.");
        await api(`/api/issues/${issueId}`, { method: "PATCH", body: { title, description, status, assigneeId } });
        closeModal();
        toast("Issue updated.");
        await onRefresh();
      } catch (e) {
        toast(e.message);
      }
    });
  } catch (e) {
    toast(e.message);
  }
}

