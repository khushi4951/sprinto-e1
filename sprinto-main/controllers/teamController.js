const { getTeam, addMember, updateMember } = require("../data/store");

async function get(req, res, next) {
  try {
    const team = await getTeam();
    res.json({ team });
  } catch (err) {
    next(err);
  }
}

async function add(req, res, next) {
  try {
    const { name, email, role } = req.body || {};
    if (!name) return res.status(400).json({ error: "BadRequest", message: "name is required" });
    const member = await addMember({ name: String(name), email: email ? String(email) : "", role: role ? String(role) : "Member" });
    res.status(201).json({ member });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const memberId = req.params.id;
    const patch = req.body || {};
    const allowed = ["name", "email", "role"];
    const cleaned = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(patch, key)) cleaned[key] = patch[key];
    }

    const member = await updateMember(memberId, cleaned);
    if (!member) return res.status(404).json({ error: "NotFound", message: "Member not found" });
    res.json({ member });
  } catch (err) {
    next(err);
  }
}

module.exports = { get, add, update };

