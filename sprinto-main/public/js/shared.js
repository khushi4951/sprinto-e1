export function html(strings, ...values) {
  return strings.map((s, i) => s + (values[i] ?? "")).join("");
}

export function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function toast(message) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = message;
  t.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => (t.hidden = true), 2400);
}

export async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data && data.message ? data.message : `Request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export function openModal({ title, bodyHtml, footerHtml }) {
  const modal = document.getElementById("modal");
  if (!modal) return;
  document.getElementById("modalTitle").textContent = title || "";
  document.getElementById("modalBody").innerHTML = bodyHtml || "";
  document.getElementById("modalFooter").innerHTML = footerHtml || "";
  modal.hidden = false;
}

export function closeModal() {
  const modal = document.getElementById("modal");
  if (!modal) return;
  modal.hidden = true;
  document.getElementById("modalBody").innerHTML = "";
  document.getElementById("modalFooter").innerHTML = "";
}

export function bindGlobalModalHandlers() {
  const modal = document.getElementById("modal");
  if (!modal) return;

  modal.addEventListener("click", (e) => {
    if (e.target && e.target.matches("[data-close]")) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });
}

export function sprintBadge(status) {
  if (status === "active") return `<span class="badge badge--active">Active</span>`;
  if (status === "completed") return `<span class="badge badge--completed">Completed</span>`;
  return `<span class="badge badge--planned">Planned</span>`;
}

