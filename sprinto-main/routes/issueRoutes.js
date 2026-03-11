const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");
const { getAll, create, update, move, remove } = require("../controllers/issueController");

const router = express.Router();

router.get("/", requireAuth, getAll);
router.post("/", requireAuth, create);
router.patch("/:id", requireAuth, update);
router.post("/:id/move", requireAuth, move);
router.delete("/:id", requireAuth, remove);

module.exports = router;

