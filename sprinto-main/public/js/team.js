import { api, escapeHtml, html, openModal, closeModal, toast } from "./shared.js";

function initials(name) {
  const parts = String(name || "U").trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "U";
}

export function teamView({ team }) {
  const members = (team?.members || []).slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const rows = members
    .map((m) => {
      return html`
        <tr class="tr">
          <td>
            <div class="member">
              <div class="avatar">${escapeHtml(initials(m.name))}</div>
              <div>
                <div style="font-weight:900">${escapeHtml(m.name)}</div>
                <div class="muted">${escapeHtml(m.email || "")}</div>
              </div>
            </div>
          </td>
          <td><span class="badge">${escapeHtml(m.role)}</span></td>
          <td style="text-align:right"><button class="btn" data-edit="${m.id}">Edit</button></td>
        </tr>
      `;
    })
    .join("");

  return html`
    <div class="grid grid--2">
      <div class="card">
        <h3 class="card__title">Add team member</h3>
        <div class="grid">
          <div class="field">
            <div class="label">Name</div>
            <input class="input" id="tmName" placeholder="Sam" />
          </div>
          <div class="field">
            <div class="label">Email</div>
            <input class="input" id="tmEmail" placeholder="sam@company.com" />
          </div>
          <div class="field">
            <div class="label">Role</div>
            <select class="select" id="tmRole">
              <option>Member</option>
              <option>Developer</option>
              <option>QA</option>
              <option>Designer</option>
              <option>Scrum Master</option>
              <option>Product Owner</option>
            </select>
          </div>
          <div class="row">
            <button class="btn btn--primary" id="addMemberBtn">Add member</button>
            <div class="spacer"></div>
            <div class="muted">Assign issues from the issue editor.</div>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="card__title">Members</h3>
        <table class="table">
          <tbody>${rows || `<tr><td class="muted">No members yet.</td></tr>`}</tbody>
        </table>
      </div>
    </div>
  `;
}

export function bindTeamHandlers({ refresh, team }) {
  const addBtn = document.getElementById("addMemberBtn");
  if (addBtn) {
    addBtn.addEventListener("click", async () => {
      try {
        const name = document.getElementById("tmName").value.trim();
        const email = document.getElementById("tmEmail").value.trim();
        const role = document.getElementById("tmRole").value;
        if (!name) return toast("Member name is required.");
        addBtn.disabled = true;
        await api("/api/team", { method: "POST", body: { name, email, role } });
        toast("Member added.");
        await refresh();
      } catch (e) {
        toast(e.message);
      } finally {
        addBtn.disabled = false;
      }
    });
  }

  document.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => openMemberEditor(btn.getAttribute("data-edit"), { refresh, team }));
  });
}

function openMemberEditor(memberId, { refresh, team }) {
  const m = (team?.members || []).find((x) => x.id === memberId);
  if (!m) return;

  openModal({
    title: "Edit member",
    bodyHtml: html`
      <div class="grid">
        <div class="field">
          <div class="label">Name</div>
          <input class="input" id="emName" value="${escapeHtml(m.name)}" />
        </div>
        <div class="field">
          <div class="label">Email</div>
          <input class="input" id="emEmail" value="${escapeHtml(m.email || "")}" />
        </div>
        <div class="field">
          <div class="label">Role</div>
          <input class="input" id="emRole" value="${escapeHtml(m.role)}" />
        </div>
      </div>
    `,
    footerHtml: `<button class="btn" data-close>Close</button><button class="btn btn--primary" id="saveMemberBtn">Save</button>`,
  });

  document.getElementById("saveMemberBtn").addEventListener("click", async () => {
    try {
      const name = document.getElementById("emName").value.trim();
      const email = document.getElementById("emEmail").value.trim();
      const role = document.getElementById("emRole").value.trim();
      if (!name) return toast("Name is required.");
      await api(`/api/team/${memberId}`, { method: "PATCH", body: { name, email, role } });
      closeModal();
      toast("Member updated.");
      await refresh();
    } catch (e) {
      toast(e.message);
    }
  });
}

