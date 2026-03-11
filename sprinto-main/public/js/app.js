import { navbarHtml } from "../components/navbar.js";
import { sidebarHtml } from "../components/sidebar.js";

import { api, bindGlobalModalHandlers, toast } from "./shared.js";
import { signInView, signUpView, bindAuthHandlers } from "./auth.js";
import { sprintsView, bindSprintsHandlers } from "./sprints.js";
import { loadBoardIssues, boardView, bindBoardHandlers } from "./board.js";
import { loadAllIssues, backlogView, bindBacklogHandlers } from "./backlog.js";
import { teamView, bindTeamHandlers } from "./team.js";

const state = {
  user: null,
  sprints: [],
  activeSprint: null,
  issues: [],
  team: { members: [] },
};

const el = {
  view: document.getElementById("view"),
  sidebarMount: document.getElementById("sidebarMount"),
  navbarMount: document.getElementById("navbarMount"),
};

function route() {
  const hash = window.location.hash || "#/dashboard";
  return hash.replace(/^#/, "");
}

function setActiveNav() {
  const current = route();
  document.querySelectorAll("[data-route]").forEach((a) => {
    const href = a.getAttribute("href").replace(/^#/, "");
    a.classList.toggle("is-active", href === current);
  });
}

function setCrumb(text) {
  const c = document.getElementById("crumb");
  if (c) c.textContent = text;
}

function setTopUser() {
  const chip = document.getElementById("userChip");
  const logoutBtn = document.getElementById("logoutBtn");
  const nameEl = document.getElementById("userName");
  const emailEl = document.getElementById("userEmail");
  const avatarEl = document.getElementById("userAvatar");
  if (!chip || !logoutBtn) return;

  if (!state.user) {
    chip.hidden = true;
    logoutBtn.hidden = true;
    return;
  }
  chip.hidden = false;
  logoutBtn.hidden = false;
  nameEl.textContent = state.user.name;
  emailEl.textContent = state.user.email;
  avatarEl.textContent = (state.user.name || "U").slice(0, 1).toUpperCase();
}

function setActiveSprintPill() {
  const pill = document.getElementById("activeSprintPill");
  if (!pill) return;
  if (!state.activeSprint) {
    pill.hidden = true;
    return;
  }
  pill.hidden = false;
  pill.textContent = `Active: ${state.activeSprint.name}`;
}

function mountShell() {
  el.sidebarMount.innerHTML = sidebarHtml();
  el.navbarMount.innerHTML = navbarHtml();

  // Sidebar interactions
  const sidebar = document.getElementById("sidebar");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const brand = sidebar?.querySelector("[data-nav]");

  mobileMenuBtn?.addEventListener("click", () => sidebar.classList.add("is-open"));
  sidebarToggle?.addEventListener("click", () => sidebar.classList.toggle("is-open"));
  brand?.addEventListener("click", () => (window.location.hash = brand.getAttribute("data-nav")));
  brand?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") window.location.hash = brand.getAttribute("data-nav");
  });

  // Logout
  document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    try {
      await api("/api/auth/logout", { method: "POST" });
    } finally {
      state.user = null;
      state.activeSprint = null;
      state.sprints = [];
      state.issues = [];
      state.team = { members: [] };
      setTopUser();
      setActiveSprintPill();
      toast("Logged out.");
      window.location.hash = "#/login";
    }
  });

  bindGlobalModalHandlers();
}

async function refreshCore() {
  const [sprints, active, team] = await Promise.all([api("/api/sprints"), api("/api/sprints/active"), api("/api/team")]);
  state.sprints = sprints.sprints || [];
  state.activeSprint = active.sprint || null;
  state.team = team.team || { members: [] };
  setActiveSprintPill();
  setTopUser();
}

function requireLoggedIn() {
  if (state.user) return true;
  window.location.hash = "#/login";
  return false;
}

function setPage(htmlStr) {
  el.view.classList.remove("page");
  // Force reflow for animation restart
  void el.view.offsetWidth;
  el.view.classList.add("page");
  el.view.innerHTML = htmlStr;
}

function dashboardView() {
  const active = state.activeSprint;
  const sprintsTotal = state.sprints.length;
  const membersTotal = (state.team.members || []).length;

  return `
    <div class="grid grid--3">
      <div class="card">
        <h3 class="card__title">Active sprint</h3>
        ${
          active
            ? `<div style="font-weight:900">${active.name}</div>
               <div class="muted">${active.goal || "No goal set"}</div>
               <div style="height:10px"></div>
               <div class="row">
                 <a class="btn btn--primary" href="#/board">Open board</a>
                 <a class="btn" href="#/backlog">Backlog</a>
               </div>`
            : `<div class="muted">No active sprint. Create one and start it.</div>
               <div style="height:10px"></div>
               <a class="btn btn--primary" href="#/sprints">Go to Sprint Management</a>`
        }
      </div>
      <div class="card">
        <h3 class="card__title">Sprints</h3>
        <div class="kpi">${sprintsTotal}<span class="muted"> total</span></div>
        <div style="height:10px"></div>
        <a class="btn" href="#/sprints">Manage sprints</a>
      </div>
      <div class="card">
        <h3 class="card__title">Team</h3>
        <div class="kpi">${membersTotal}<span class="muted"> members</span></div>
        <div style="height:10px"></div>
        <a class="btn" href="#/team">Manage team</a>
      </div>
    </div>
  `;
}

async function bootstrap() {
  mountShell();
  try {
    const me = await api("/api/auth/me");
    state.user = me.user;
  } catch {
    state.user = null;
  }
  if (state.user) await refreshCore();
  await render();
}

async function render() {
  setActiveNav();
  const p = route();

  // Auth routes
  if (p === "/login") {
    document.body.classList.add("auth-mode");
    setCrumb("Sign In");
    setPage(signInView());
    bindAuthHandlers({
      onAuthed: async (user) => {
        state.user = user;
        await refreshCore();
        window.location.hash = "#/dashboard";
      },
    });
    return;
  }
  if (p === "/signup") {
    document.body.classList.add("auth-mode");
    setCrumb("Sign Up");
    setPage(signUpView());
    bindAuthHandlers({
      onAuthed: async (user) => {
        state.user = user;
        await refreshCore();
        window.location.hash = "#/dashboard";
      },
    });
    return;
  }

  // Protected routes
  document.body.classList.remove("auth-mode");
  if (!requireLoggedIn()) return;

  if (p === "/dashboard") {
    setCrumb("Dashboard");
    setPage(dashboardView());
    return;
  }

  if (p === "/sprints") {
    setCrumb("Sprint Management");
    await refreshCore();
    setPage(sprintsView({ sprints: state.sprints, activeSprint: state.activeSprint }));
    bindSprintsHandlers({ refresh: async () => {
      await refreshCore();
      await render();
    }});
    return;
  }

  if (p === "/team") {
    setCrumb("Team Members");
    await refreshCore();
    setPage(teamView({ team: state.team }));
    bindTeamHandlers({
      refresh: async () => {
        await refreshCore();
        await render();
      },
      team: state.team,
    });
    return;
  }

  if (p === "/board") {
    setCrumb("Kanban Board");
    await refreshCore();
    state.issues = await loadBoardIssues(state.activeSprint);
    setPage(boardView({ activeSprint: state.activeSprint, issues: state.issues, team: state.team }));
    bindBoardHandlers({
      activeSprint: state.activeSprint,
      team: state.team,
      onRefresh: async () => {
        state.issues = await loadBoardIssues(state.activeSprint);
        await refreshCore();
        await render();
      },
      getIssues: async () => state.issues,
    });
    return;
  }

  if (p === "/backlog") {
    setCrumb("Backlog View");
    await refreshCore();
    state.issues = await loadAllIssues();
    setPage(backlogView({ sprints: state.sprints, issues: state.issues, team: state.team }));
    bindBacklogHandlers({
      refresh: async () => {
        await refreshCore();
        state.issues = await loadAllIssues();
        await render();
      },
      sprints: state.sprints,
    });
    return;
  }

  window.location.hash = "#/dashboard";
}

window.addEventListener("hashchange", async () => {
  await render();
  const sidebar = document.getElementById("sidebar");
  if (sidebar?.classList.contains("is-open")) sidebar.classList.remove("is-open");
});

bootstrap();

