const bcrypt = require("bcryptjs");

const { createUser, getUserByEmail, createSession, deleteSession, getUserById } = require("../data/store");

function publicUser(user) {
  return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
}

async function signup(req, res, next) {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "BadRequest", message: "email and password are required" });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Conflict", message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await createUser({ email: String(email), passwordHash, name: name ? String(name) : undefined });

    const session = await createSession({ userId: user.id });
    res.cookie("sid", session.id, { httpOnly: true, sameSite: "lax" });
    res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "BadRequest", message: "email and password are required" });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });
    }

    const session = await createSession({ userId: user.id });
    res.cookie("sid", session.id, { httpOnly: true, sameSite: "lax" });
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const sid = req.cookies && req.cookies.sid;
    if (sid) await deleteSession(sid);
    res.clearCookie("sid");
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: "NotFound", message: "User not found" });
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login, logout, me };

