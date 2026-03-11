const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");
const { getAll, create, start, complete, active } = require("../controllers/sprintController");

const router = express.Router();

router.get("/", requireAuth, getAll);
router.post("/", requireAuth, create);
router.get("/active", requireAuth, active);
router.post("/:id/start", requireAuth, start);
router.post("/:id/complete", requireAuth, complete);

module.exports = router;

