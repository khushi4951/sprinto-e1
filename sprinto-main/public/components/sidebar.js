export function sidebarHtml() {
  return `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar__top">
        <div class="brand" role="button" tabindex="0" data-nav="#/dashboard" aria-label="Go to dashboard">
          <div class="brand__logo">S</div>
          <div class="brand__text">
            <div class="brand__name">Sprinto</div>
            <div class="brand__tag">Sprint Management</div>
          </div>
        </div>
        <button class="icon-btn sidebar__toggle" id="sidebarToggle" aria-label="Toggle sidebar">
          <span class="icon">≡</span>
        </button>
      </div>

      <nav class="nav" aria-label="Sidebar navigation">
        <a class="nav__link" href="#/dashboard" data-route>Dashboard</a>
        <a class="nav__link" href="#/sprints" data-route>Sprint Management</a>
        <a class="nav__link" href="#/board" data-route>Kanban Board</a>
        <a class="nav__link" href="#/backlog" data-route>Backlog View</a>
        <a class="nav__link" href="#/team" data-route>Team Members</a>
      </nav>

      <div class="sidebar__bottom">
        <div class="user-chip" id="userChip" hidden>
          <div class="user-chip__avatar" id="userAvatar"></div>
          <div class="user-chip__meta">
            <div class="user-chip__name" id="userName"></div>
            <div class="user-chip__email" id="userEmail"></div>
          </div>
        </div>
        <button class="btn btn--ghost" id="logoutBtn" hidden>Logout</button>
      </div>
    </aside>
  `;
}

