import { api, toast } from "./shared.js";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function setFieldError(container, message) {
  const help = container.querySelector("[data-help]");
  if (!help) return;
  help.textContent = message || "";
  help.classList.toggle("help--error", Boolean(message));
}

export function signInView() {
  return `
    <div class="auth">
      <div class="auth__panel">
        <div class="auth__brand">
          <div class="brand__logo">S</div>
          <div>
            <div class="auth__title">Sign in</div>
            <div class="muted">Welcome back. Manage sprints like a pro.</div>
          </div>
        </div>

        <div class="grid">
          <div class="field" id="siEmailField">
            <div class="label">Email</div>
            <input class="input" id="siEmail" inputmode="email" autocomplete="email" placeholder="you@company.com" />
            <div class="help" data-help></div>
          </div>
          <div class="field" id="siPassField">
            <div class="label">Password</div>
            <input class="input" id="siPassword" type="password" autocomplete="current-password" placeholder="••••••••" />
            <div class="help" data-help></div>
          </div>
          <div class="row">
            <button class="btn btn--primary" id="signInBtn">Sign in</button>
            <div class="spacer"></div>
            <a class="btn btn--ghost" href="#/signup">Create account</a>
          </div>
          <div class="muted" style="font-size:12px">Your session is stored on the server and referenced by an HttpOnly cookie.</div>
        </div>
      </div>

      <div class="auth__side">
        <div class="auth-hero">
          <div class="auth-hero__badge">
            <span class="auth-hero__spark">⚡</span>
            <span>The modern Jira alternative</span>
            <span class="auth-hero__arrow">→</span>
          </div>

          <h2 class="auth-hero__title">Ship sprints faster</h2>

          <p class="auth-hero__subtitle">
            Sprinto brings sprint planning, kanban boards, and backlog management into one beautifully crafted workspace.
          </p>

          <div class="auth-hero__actions">
            <a class="btn btn--primary auth-hero__cta" href="#/signup">Start for free <span aria-hidden="true">→</span></a>
            <a class="btn btn--ghost auth-hero__cta2" href="#/dashboard">See how it works</a>
          </div>

          <div class="auth-hero__stats" aria-label="Product stats">
            <div class="auth-stat">
              <div class="auth-stat__value">10k+</div>
              <div class="auth-stat__label">active teams</div>
            </div>
            <div class="auth-stat">
              <div class="auth-stat__value">2M+</div>
              <div class="auth-stat__label">issues tracked</div>
            </div>
            <div class="auth-stat">
              <div class="auth-stat__value">99.9%</div>
              <div class="auth-stat__label">uptime SLA</div>
            </div>
            <div class="auth-stat">
              <div class="auth-stat__value">&lt;200ms</div>
              <div class="auth-stat__label">avg response</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function signUpView() {
  return `
    <div class="auth">
      <div class="auth__panel">
        <div class="auth__brand">
          <div class="brand__logo">S</div>
          <div>
            <div class="auth__title">Sign up</div>
            <div class="muted">Create your workspace in seconds.</div>
          </div>
        </div>

        <div class="grid">
          <div class="field" id="suNameField">
            <div class="label">Name</div>
            <input class="input" id="suName" autocomplete="name" placeholder="Alex" />
            <div class="help" data-help></div>
          </div>
          <div class="field" id="suEmailField">
            <div class="label">Email</div>
            <input class="input" id="suEmail" inputmode="email" autocomplete="email" placeholder="alex@company.com" />
            <div class="help" data-help></div>
          </div>
          <div class="field" id="suPassField">
            <div class="label">Password</div>
            <input class="input" id="suPassword" type="password" autocomplete="new-password" placeholder="At least 6 characters" />
            <div class="help" data-help></div>
          </div>
          <div class="row">
            <button class="btn btn--primary" id="signUpBtn">Create account</button>
            <div class="spacer"></div>
            <a class="btn btn--ghost" href="#/login">I already have an account</a>
          </div>
        </div>
      </div>

      <div class="auth__side">
        <div class="auth-hero">
          <div class="auth-hero__badge">
            <span class="auth-hero__spark">⚡</span>
            <span>Built for speed and focus</span>
            <span class="auth-hero__arrow">→</span>
          </div>

          <h2 class="auth-hero__title">Create your workspace</h2>

          <p class="auth-hero__subtitle">
            Invite your team, plan sprints, and move issues across your board—without the clutter.
          </p>

          <div class="auth-hero__actions">
            <a class="btn btn--primary auth-hero__cta" href="#/signup">Start for free <span aria-hidden="true">→</span></a>
            <a class="btn btn--ghost auth-hero__cta2" href="#/login">Sign in instead</a>
          </div>

          <div class="auth-hero__stats" aria-label="Product highlights">
            <div class="auth-stat">
              <div class="auth-stat__value">Boards</div>
              <div class="auth-stat__label">kanban-ready</div>
            </div>
            <div class="auth-stat">
              <div class="auth-stat__value">Backlog</div>
              <div class="auth-stat__label">triage fast</div>
            </div>
            <div class="auth-stat">
              <div class="auth-stat__value">Sprints</div>
              <div class="auth-stat__label">plan & ship</div>
            </div>
            <div class="auth-stat">
              <div class="auth-stat__value">Team</div>
              <div class="auth-stat__label">invite anyone</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindAuthHandlers({ onAuthed }) {
  const signInBtn = document.getElementById("signInBtn");
  if (signInBtn) {
    signInBtn.addEventListener("click", async () => {
      const email = document.getElementById("siEmail").value.trim();
      const password = document.getElementById("siPassword").value;

      setFieldError(document.getElementById("siEmailField"), validateEmail(email) ? "" : "Enter a valid email.");
      setFieldError(document.getElementById("siPassField"), password && password.length >= 6 ? "" : "Password must be at least 6 characters.");
      if (!validateEmail(email) || !password || password.length < 6) return;

      try {
        signInBtn.disabled = true;
        const data = await api("/api/auth/login", { method: "POST", body: { email, password } });
        toast("Welcome back.");
        await onAuthed(data.user);
      } catch (e) {
        toast(e.message);
      } finally {
        signInBtn.disabled = false;
      }
    });
  }

  const signUpBtn = document.getElementById("signUpBtn");
  if (signUpBtn) {
    signUpBtn.addEventListener("click", async () => {
      const name = document.getElementById("suName").value.trim();
      const email = document.getElementById("suEmail").value.trim();
      const password = document.getElementById("suPassword").value;

      setFieldError(document.getElementById("suNameField"), name ? "" : "Name is required.");
      setFieldError(document.getElementById("suEmailField"), validateEmail(email) ? "" : "Enter a valid email.");
      setFieldError(document.getElementById("suPassField"), password && password.length >= 6 ? "" : "Password must be at least 6 characters.");
      if (!name || !validateEmail(email) || !password || password.length < 6) return;

      try {
        signUpBtn.disabled = true;
        const data = await api("/api/auth/signup", { method: "POST", body: { name, email, password } });
        toast("Account created.");
        await onAuthed(data.user);
      } catch (e) {
        toast(e.message);
      } finally {
        signUpBtn.disabled = false;
      }
    });
  }
}

