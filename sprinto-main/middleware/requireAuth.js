/**
 * Auth middleware
 *
 * Client-server concept:
 * - The client includes a session cookie (sid) on requests.
 * - The server validates the session and attaches `req.user`.
 */

const { getSessionById } = require("../data/store");

async function requireAuth(req, res, next) {
  try {
    const sid = req.cookies && req.cookies.sid;
    if (!sid) {
      return res.status(401).json({ error: "Unauthorized", message: "Missing session" });
    }

    const session = await getSessionById(sid);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized", message: "Invalid session" });
    }

    req.user = { id: session.userId };
    req.session = session;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { requireAuth };

