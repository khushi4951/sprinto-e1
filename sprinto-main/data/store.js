/**
 * JSON file datastore (fs-based)
 *
 * For evaluation simplicity, we store data under `/data/*.json`.
 * This demonstrates file handling using Node's `fs` module.
 */

const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");

const DATA_DIR = path.join(__dirname);

const FILES = {
  users: path.join(DATA_DIR, "users.json"),
  sessions: path.join(DATA_DIR, "sessions.json"),
  sprints: path.join(DATA_DIR, "sprints.json"),
  issues: path.join(DATA_DIR, "issues.json"),
  team: path.join(DATA_DIR, "team.json"),
};

const DEFAULTS = {
  users: [],
  sessions: [],
  sprints: [],
  issues: [],
  team: { members: [] },
};

function ensureDataFilesExist() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  for (const [key, filePath] of Object.entries(FILES)) {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(DEFAULTS[key], null, 2), "utf8");
    }
  }
}

async function readJson(key) {
  const filePath = FILES[key];
  const raw = await fsp.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function writeJson(key, value) {
  const filePath = FILES[key];
  const tmpPath = `${filePath}.tmp`;
  await fsp.writeFile(tmpPath, JSON.stringify(value, null, 2), "utf8");
  await fsp.rename(tmpPath, filePath);
}

function id(prefix) {
  return `${prefix}_${randomUUID()}`;
}

// ---- Users
async function getUserByEmail(email) {
  const users = await readJson("users");
  return users.find((u) => u.email.toLowerCase() === String(email).toLowerCase()) || null;
}

async function getUserById(userId) {
  const users = await readJson("users");
  return users.find((u) => u.id === userId) || null;
}

async function createUser({ email, passwordHash, name }) {
  const users = await readJson("users");
  const user = {
    id: id("usr"),
    email,
    name: name || email.split("@")[0],
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await writeJson("users", users);
  return user;
}

// ---- Sessions
async function getSessionById(sessionId) {
  const sessions = await readJson("sessions");
  return sessions.find((s) => s.id === sessionId) || null;
}

async function createSession({ userId }) {
  const sessions = await readJson("sessions");
  const session = {
    id: id("sid"),
    userId,
    createdAt: new Date().toISOString(),
  };
  sessions.push(session);
  await writeJson("sessions", sessions);
  return session;
}

async function deleteSession(sessionId) {
  const sessions = await readJson("sessions");
  const next = sessions.filter((s) => s.id !== sessionId);
  await writeJson("sessions", next);
}

// ---- Sprints
async function listSprints() {
  return await readJson("sprints");
}

async function getSprintById(sprintId) {
  const sprints = await readJson("sprints");
  return sprints.find((s) => s.id === sprintId) || null;
}

async function createSprint({ name, goal, startDate, endDate }) {
  const sprints = await readJson("sprints");
  const sprint = {
    id: id("spr"),
    name,
    goal: goal || "",
    status: "planned", // planned | active | completed
    startDate: startDate || null,
    endDate: endDate || null,
    createdAt: new Date().toISOString(),
    startedAt: null,
    completedAt: null,
  };
  sprints.push(sprint);
  await writeJson("sprints", sprints);
  return sprint;
}

async function updateSprint(sprintId, patch) {
  const sprints = await readJson("sprints");
  const idx = sprints.findIndex((s) => s.id === sprintId);
  if (idx === -1) return null;
  sprints[idx] = { ...sprints[idx], ...patch };
  await writeJson("sprints", sprints);
  return sprints[idx];
}

async function getActiveSprint() {
  const sprints = await readJson("sprints");
  return sprints.find((s) => s.status === "active") || null;
}

// ---- Issues
async function listIssues() {
  return await readJson("issues");
}

async function getIssueById(issueId) {
  const issues = await readJson("issues");
  return issues.find((i) => i.id === issueId) || null;
}

async function createIssue({ title, description, sprintId, status }) {
  const issues = await readJson("issues");
  const issue = {
    id: id("iss"),
    title,
    description: description || "",
    sprintId: sprintId || null, // null = unassigned backlog
    status: status || "todo", // todo | in_progress | done
    assigneeId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  issues.push(issue);
  await writeJson("issues", issues);
  return issue;
}

async function updateIssue(issueId, patch) {
  const issues = await readJson("issues");
  const idx = issues.findIndex((i) => i.id === issueId);
  if (idx === -1) return null;
  issues[idx] = { ...issues[idx], ...patch, updatedAt: new Date().toISOString() };
  await writeJson("issues", issues);
  return issues[idx];
}

async function deleteIssue(issueId) {
  const issues = await readJson("issues");
  const next = issues.filter((i) => i.id !== issueId);
  await writeJson("issues", next);
}

// ---- Team
async function getTeam() {
  return await readJson("team");
}

async function addMember({ name, email, role }) {
  const team = await readJson("team");
  const member = { id: id("mem"), name, email: email || "", role: role || "Member", createdAt: new Date().toISOString() };
  team.members.push(member);
  await writeJson("team", team);
  return member;
}

async function updateMember(memberId, patch) {
  const team = await readJson("team");
  const idx = team.members.findIndex((m) => m.id === memberId);
  if (idx === -1) return null;
  team.members[idx] = { ...team.members[idx], ...patch };
  await writeJson("team", team);
  return team.members[idx];
}

module.exports = {
  ensureDataFilesExist,
  readJson,
  writeJson,
  // users
  getUserByEmail,
  getUserById,
  createUser,
  // sessions
  getSessionById,
  createSession,
  deleteSession,
  // sprints
  listSprints,
  getSprintById,
  createSprint,
  updateSprint,
  getActiveSprint,
  // issues
  listIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
  // team
  getTeam,
  addMember,
  updateMember,
};

