import { api, escapeHtml, html, openModal, closeModal, sprintBadge, toast } from "./shared.js";
import { issueCardHtml } from "../components/card.js";

function findMemberName(team, id) {
  const m = (team?.members || []).find((x) => x.id === id);
  return m ? m.name : "Unassigned";
}

export async function loadAllIssues() {
  const all = await api("/api/issues");
  return all.issues || [];
}

export function backlogView({ sprints, issues, team }) {
  const sprintById = new Map((sprints || []).map((s) => [s.id, s]));
  const groups = new Map();
  groups.set("backlog", { title: "Unassigned (Backlog)", sprint: null, issues: [] });
  for (const s of sprints || []) groups.set(s.id, { title: s.name, sprint: s, issues: [] });

  for (const i of issues || []) {
    const key = i.sprintId || "backlog";
    if (!groups.has(key)) groups.set(key, { title: "Unknown sprint", sprint: sprintById.get(i.sprintId) || null, issues: [] });
    groups.get(key).issues.push(i);
  }

  const sections = Array.from(groups.entries())
    .sort((a, b) => {
      if (a[0] === "backlog") return -1;
      if (b[0] === "backlog") return 1;
      return (b[1].sprint?.createdAt || "").localeCompare(a[1].sprint?.createdAt || "");
    })
    .map(([key, g]) => {
      const meta = g.sprint
        ? `${sprintBadge(g.sprint.status)} <span class="muted">${escapeHtml(g.sprint.goal || "")}</span>`
        : `<span class="muted">Issues not assigned to a sprint</span>`;

      const items =
        g.issues.length === 0
          ? `<div class="muted">No issues.</div>`
          : g.issues
              .slice()
              .sort((x, y) => (x.updatedAt < y.updatedAt ? 1 : -1))
              .map((i) => issueCardHtml(i, { assigneeName: i.assigneeId ? findMemberName(team, i.assigneeId) : "Unassigned", draggable: false }))
              .join("");

      return html`
        <div class="collapse ${key === "backlog" ? "is-open" : ""}" data-collapse>
          <div class="collapse__head">
            <div style="font-weight:900">${escapeHtml(g.title)}</div>
            <div class="spacer"></div>
            <div class="muted">${g.issues.length} issues</div>
            <div class="chev">▾</div>
          </div>
          <div class="collapse__body">
            <div class="row" style="margin-bottom:10px">${meta}</div>
            ${items}
          </div>
        </div>
      `;
    })
    .join("");

  const sprintOptions = [
    `<option value="">Unassigned (Backlog)</option>`,
    ...(sprints || []).map((s) => `<option value="${s.id}">${escapeHtml(s.name)}</option>`),
  ].join("");

  return html`
    <div class="row">
      <div class="muted">Grouped by sprint. Expand sections to view issues.</div>
      <div class="spacer"></div>
      <button class="btn btn--primary" id="newIssueFromBacklog">New issue</button>
    </div>
    <div style="height:12px"></div>
    <div class="grid">${sections}</div>

    <template id="backlogNewIssueTpl">
      <div class="grid">
        <div class="field">
          <div class="label">Title</div>
          <input class="input" id="biTitle" placeholder="Add role-based assignment" />
        </div>
        <div class="field">
          <div class="label">Description</div>
          <textarea class="textarea" id="biDesc"></textarea>
        </div>
        <div class="field">
          <div class="label">Assign to sprint</div>
          <select class="select" id="biSprint">${sprintOptions}</select>
        </div>
      </div>
    </template>
  `;
}

export function bindBacklogHandlers({ refresh, sprints }) {
  document.querySelectorAll("[data-collapse]").forEach((c) => {
    c.querySelector(".collapse__head").addEventListener("click", () => c.classList.toggle("is-open"));
  });

  const btn = document.getElementById("newIssueFromBacklog");
  if (btn) {
    btn.addEventListener("click", () => {
      const tpl = document.getElementById("backlogNewIssueTpl");
      openModal({
        title: "Create issue (backlog)",
        bodyHtml: tpl ? tpl.innerHTML : "",
        footerHtml: `<button class="btn" data-close>Cancel</button><button class="btn btn--primary" id="biCreateBtn">Create</button>`,
      });

      document.getElementById("biCreateBtn").addEventListener("click", async () => {
        try {
          const title = document.getElementById("biTitle").value.trim();
          const description = document.getElementById("biDesc").value.trim();
          const sprintId = document.getElementById("biSprint").value || null;
          if (!title) return toast("Title is required.");
          await api("/api/issues", { method: "POST", body: { title, description, sprintId, status: "todo" } });
          closeModal();
          toast("Issue created.");
          await refresh();
        } catch (e) {
          toast(e.message);
        }
      });
    });
  }

  // Allow assigning issues to sprint from backlog by clicking a card
  document.querySelectorAll(".issue").forEach((card) => {
    card.addEventListener("click", async () => {
      const issueId = card.getAttribute("data-issue");
      const sprintOptions = [
        `<option value="">Unassigned (Backlog)</option>`,
        ...(sprints || []).map((s) => `<option value="${s.id}">${escapeHtml(s.name)}</option>`),
      ].join("");

      openModal({
        title: "Assign issue to sprint",
        bodyHtml: `
          <div class="grid">
            <div class="field">
              <div class="label">Sprint</div>
              <select class="select" id="asSprintSelect">${sprintOptions}</select>
              <div class="help" data-help></div>
            </div>
            <div class="muted" style="font-size:12px">Assigning helps keep your backlog organized by sprint.</div>
          </div>
        `,
        footerHtml: `<button class="btn" data-close>Cancel</button><button class="btn btn--primary" id="assignSprintBtn">Assign</button>`,
      });
      document.getElementById("assignSprintBtn").addEventListener("click", async () => {
        try {
          const sprintId = document.getElementById("asSprintSelect").value || null;
          await api(`/api/issues/${issueId}`, { method: "PATCH", body: { sprintId } });
          closeModal();
          toast("Issue assigned.");
          await refresh();
        } catch (e) {
          toast(e.message);
        }
      });
    });
  });
}

