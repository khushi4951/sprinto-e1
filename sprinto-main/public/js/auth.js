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
        <div class="card">
          <h3 class="card__title">Sprint Management</h3>
          <div class="muted">Create → start → complete sprints, move issues on a Kanban board, and keep a structured backlog.</div>
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
        <div class="card">
          <h3 class="card__title">Professional UI</h3>
          <div class="muted">A modern dark theme with glass effects, rounded components, and smooth interactions inspired by Jira/Linear.</div>
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

