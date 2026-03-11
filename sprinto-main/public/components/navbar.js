export function navbarHtml() {
  return `
    <header class="topbar">
      <div class="topbar__left">
        <button class="icon-btn mobile-only" id="mobileMenuBtn" aria-label="Open menu">
          <span class="icon">≡</span>
        </button>
        <div class="crumb" id="crumb">Dashboard</div>
      </div>
      <div class="topbar__right">
        <div class="pill" id="activeSprintPill" hidden></div>
      </div>
    </header>
  `;
}

