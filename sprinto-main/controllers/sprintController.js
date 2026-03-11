const { listSprints, createSprint, updateSprint, getSprintById, getActiveSprint, listIssues, updateIssue } = require("../data/store");

async function getAll(req, res, next) {
  try {
    const sprints = await listSprints();
    res.json({ sprints });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, goal, startDate, endDate } = req.body || {};
    if (!name) return res.status(400).json({ error: "BadRequest", message: "name is required" });
    const sprint = await createSprint({ name: String(name), goal: goal ? String(goal) : "", startDate: startDate || null, endDate: endDate || null });
    res.status(201).json({ sprint });
  } catch (err) {
    next(err);
  }
}

async function start(req, res, next) {
  try {
    const sprintId = req.params.id;
    const sprint = await getSprintById(sprintId);
    if (!sprint) return res.status(404).json({ error: "NotFound", message: "Sprint not found" });
    if (sprint.status === "completed") return res.status(409).json({ error: "Conflict", message: "Sprint already completed" });

    const active = await getActiveSprint();
    if (active && active.id !== sprintId) {
      return res.status(409).json({ error: "Conflict", message: "Another sprint is already active" });
    }

    const updated = await updateSprint(sprintId, { status: "active", startedAt: new Date().toISOString() });
    res.json({ sprint: updated });
  } catch (err) {
    next(err);
  }
}

async function complete(req, res, next) {
  try {
    const sprintId = req.params.id;
    const sprint = await getSprintById(sprintId);
    if (!sprint) return res.status(404).json({ error: "NotFound", message: "Sprint not found" });
    if (sprint.status !== "active") return res.status(409).json({ error: "Conflict", message: "Only active sprints can be completed" });

    // Optionally move unfinished issues back to backlog (todo/in_progress -> backlog sprintId=null)
    const issues = await listIssues();
    const affected = issues.filter((i) => i.sprintId === sprintId && i.status !== "done");
    for (const issue of affected) {
      // eslint-disable-next-line no-await-in-loop
      await updateIssue(issue.id, { sprintId: null, status: "todo" });
    }

    const updated = await updateSprint(sprintId, { status: "completed", completedAt: new Date().toISOString() });
    res.json({ sprint: updated, movedIssues: affected.map((i) => i.id) });
  } catch (err) {
    next(err);
  }
}

async function active(req, res, next) {
  try {
    const sprint = await getActiveSprint();
    res.json({ sprint });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, create, start, complete, active };

