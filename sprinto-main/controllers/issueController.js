const { listIssues, createIssue, getIssueById, updateIssue, deleteIssue, getActiveSprint } = require("../data/store");

async function getAll(req, res, next) {
  try {
    const { sprintId } = req.query || {};
    const issues = await listIssues();
    const filtered = sprintId ? issues.filter((i) => i.sprintId === sprintId) : issues;
    res.json({ issues: filtered });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { title, description, sprintId, status } = req.body || {};
    if (!title) return res.status(400).json({ error: "BadRequest", message: "title is required" });
    const issue = await createIssue({
      title: String(title),
      description: description ? String(description) : "",
      sprintId: sprintId || null,
      status: status || "todo",
    });
    res.status(201).json({ issue });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const issueId = req.params.id;
    const existing = await getIssueById(issueId);
    if (!existing) return res.status(404).json({ error: "NotFound", message: "Issue not found" });

    const patch = req.body || {};
    const allowed = ["title", "description", "status", "sprintId", "assigneeId"];
    const cleaned = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(patch, key)) cleaned[key] = patch[key];
    }

    const updated = await updateIssue(issueId, cleaned);
    res.json({ issue: updated });
  } catch (err) {
    next(err);
  }
}

async function move(req, res, next) {
  try {
    const issueId = req.params.id;
    const { status } = req.body || {};
    if (!status) return res.status(400).json({ error: "BadRequest", message: "status is required" });

    const existing = await getIssueById(issueId);
    if (!existing) return res.status(404).json({ error: "NotFound", message: "Issue not found" });

    const normalized = String(status);
    if (!["todo", "in_progress", "done"].includes(normalized)) {
      return res.status(400).json({ error: "BadRequest", message: "Invalid status" });
    }

    // If moving on a board, make sure the issue belongs to active sprint or gets assigned to active.
    const active = await getActiveSprint();
    const updated = await updateIssue(issueId, { status: normalized, sprintId: existing.sprintId || (active ? active.id : null) });
    res.json({ issue: updated });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const issueId = req.params.id;
    const existing = await getIssueById(issueId);
    if (!existing) return res.status(404).json({ error: "NotFound", message: "Issue not found" });
    await deleteIssue(issueId);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, create, update, move, remove };

