/**
 * Auth routes module
 *
 * Routing concept:
 * - Separate routes into modules by feature area.
 * - Keep request validation + persistence logic in controllers.
 */

const express = require("express");
const { signup, login, logout, me } = require("../controllers/authController");
const { requireAuth } = require("../middleware/requireAuth");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

module.exports = router;

