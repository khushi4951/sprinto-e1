import { api, escapeHtml, html, sprintBadge, toast } from "./shared.js";

export function sprintsView({ sprints, activeSprint }) {
  const rows = (sprints || [])
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .map((s) => {
      const isActive = activeSprint && activeSprint.id === s.id;
      const canStart = s.status !== "completed" && !activeSprint;
      const canComplete = isActive;

      return html`
        <tr class="tr">
          <td>
            <div style="font-weight:900">${escapeHtml(s.name)}</div>
            <div class="muted">${escapeHtml(s.goal || "")}</div>
          </td>
          <td>${sprintBadge(s.status)}</td>
          <td class="muted">${escapeHtml(s.startDate || "—")} → ${escapeHtml(s.endDate || "—")}</td>
          <td style="text-align:right">
            <div class="row" style="justify-content:flex-end">
              <button class="btn" data-start="${s.id}" ${canStart ? "" : "disabled"}>Start</button>
              <button class="btn btn--primary" data-complete="${s.id}" ${canComplete ? "" : "disabled"}>Complete</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  const activeCard = activeSprint
    ? html`
        <div class="card">
          <h3 class="card__title">Active sprint</h3>
          <div style="font-weight:900">${escapeHtml(activeSprint.name)}</div>
          <div class="muted">${escapeHtml(activeSprint.goal || "No goal set")}</div>
          <div style="height:10px"></div>
          <div class="row">
            <span class="badge badge--active">Running</span>
            <span class="muted">Only one sprint can be active at a time.</span>
          </div>
        </div>
      `
    : html`
        <div class="card">
          <h3 class="card__title">Active sprint</h3>
          <div class="muted">No active sprint. Start a planned sprint.</div>
        </div>
      `;

  return html`
    <div class="grid grid--2">
      <div class="card">
        <h3 class="card__title">Create sprint</h3>
        <div class="grid">
          <div class="field">
            <div class="label">Name</div>
            <input class="input" id="spName" placeholder="Sprint 12" />
          </div>
          <div class="field">
            <div class="label">Goal</div>
            <input class="input" id="spGoal" placeholder="Ship onboarding improvements" />
          </div>
          <div class="grid grid--2">
            <div class="field">
              <div class="label">Start date</div>
              <input class="input" id="spStart" placeholder="2026-03-11" />
            </div>
            <div class="field">
              <div class="label">End date</div>
              <input class="input" id="spEnd" placeholder="2026-03-25" />
            </div>
          </div>
          <div class="row">
            <button class="btn btn--primary" id="createSprintBtn">Create sprint</button>
            <div class="spacer"></div>
            <div class="muted">View history on the right.</div>
          </div>
        </div>
      </div>

      <div class="grid">
        ${activeCard}
        <div class="card">
          <h3 class="card__title">Sprint history</h3>
          <table class="table">
            <tbody>${rows || `<tr><td class="muted">No sprints yet.</td></tr>`}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function bindSprintsHandlers({ refresh }) {
  const createBtn = document.getElementById("createSprintBtn");
  if (createBtn) {
    createBtn.addEventListener("click", async () => {
      try {
        const name = document.getElementById("spName").value.trim();
        const goal = document.getElementById("spGoal").value.trim();
        const startDate = document.getElementById("spStart").value.trim() || null;
        const endDate = document.getElementById("spEnd").value.trim() || null;

        if (!name) return toast("Sprint name is required.");

        createBtn.disabled = true;
        await api("/api/sprints", { method: "POST", body: { name, goal, startDate, endDate } });
        toast("Sprint created.");
        await refresh();
      } catch (e) {
        toast(e.message);
      } finally {
        createBtn.disabled = false;
      }
    });
  }

  document.querySelectorAll("[data-start]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        btn.disabled = true;
        await api(`/api/sprints/${btn.getAttribute("data-start")}/start`, { method: "POST" });
        toast("Sprint started.");
        await refresh();
      } catch (e) {
        toast(e.message);
      } finally {
        btn.disabled = false;
      }
    });
  });

  document.querySelectorAll("[data-complete]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        btn.disabled = true;
        await api(`/api/sprints/${btn.getAttribute("data-complete")}/complete`, { method: "POST" });
        toast("Sprint completed.");
        await refresh();
      } catch (e) {
        toast(e.message);
      } finally {
        btn.disabled = false;
      }
    });
  });
}

